import { IsNull, QueryFailedError } from 'typeorm';
import { CreateAppointmentDto } from '../interfaces/IAppointments';
import { sendTurnConfirmation, sendNewAppointmentNotification } from './mailerService';
import Appointment from '../entities/Appointments';
import { AppointmentModel, CategoryModel, UserModel, BlockedSlotModel } from '../config/AppDataSources';
import { isValidTimeSlot, isValidWeekday, isPastSlot, TIME_SLOT_ERROR, WEEKDAY_ERROR } from '../utils/schedule';
import { badRequest, conflict, notFound } from '../utils/HttpError';
import { toAppointmentDto, AppointmentDto } from '../dtos';

const PG_UNIQUE_VIOLATION = '23505';

export const getAllAppointmentsService = async (): Promise<AppointmentDto[]> => {
    const appointments = await AppointmentModel.find({ order: { date: 'DESC', time: 'ASC' } });
    return appointments.map(toAppointmentDto);
};

export const getTakenSlotsByDateService = async (date: string) => {
    const [appointments, blockEntries] = await Promise.all([
        AppointmentModel.find({
            where: { date, status: 'active' },
            select: { id: true, time: true },
            loadEagerRelations: false,
        }),
        BlockedSlotModel.find({ where: { date } }),
    ]);

    return {
        takenSlots: appointments.map(a => a.time),
        blockedSlots: blockEntries.filter(b => b.time !== null).map(b => ({ id: b.id, time: b.time! })),
        isDayBlocked: blockEntries.some(b => b.time === null),
    };
};

export const getAppointmentsByUserService = async (userId: number): Promise<AppointmentDto[]> => {
    const appointments = await AppointmentModel.find({
        where: { user: { id: userId } },
        order: { date: 'DESC', time: 'ASC' },
    });
    return appointments.map(toAppointmentDto);
};

export const getAppointmentEntityById = async (id: number): Promise<Appointment> => {
    const appointment = await AppointmentModel.findOne({ where: { id } });
    if (!appointment) throw notFound("Turno no encontrado");
    return appointment;
};

export const createAppointmentService = async (data: CreateAppointmentDto): Promise<AppointmentDto> => {
    const [user, service] = await Promise.all([
        UserModel.findOne({ where: { id: data.userId } }),
        CategoryModel.findOne({ where: { id: data.serviceId } }),
    ]);
    if (!user) throw notFound("Usuario no encontrado");
    if (!service) throw notFound("Servicio no encontrado");

    if (!isValidWeekday(data.date)) throw badRequest(WEEKDAY_ERROR);
    if (!isValidTimeSlot(data.time)) throw badRequest(TIME_SLOT_ERROR);
    if (isPastSlot(data.date, data.time)) throw badRequest("No se puede agendar un turno en una fecha u hora pasada");

    const blocked = await BlockedSlotModel.count({
        where: [
            { date: data.date, time: data.time },
            { date: data.date, time: IsNull() },
        ],
    });
    if (blocked > 0) throw conflict("Este horario no está disponible");

    const taken = await AppointmentModel.count({ where: { date: data.date, time: data.time, status: 'active' } });
    if (taken > 0) throw conflict("Ya existe un turno en esa fecha y hora");

    let saved: Appointment;
    try {
        saved = await AppointmentModel.save(AppointmentModel.create({
            date: data.date,
            time: data.time,
            user,
            category: service,
            status: 'active',
        }));
    } catch (err) {
        // Dos reservas simultáneas: el índice único UQ_active_slot rechaza la segunda
        if (err instanceof QueryFailedError && (err.driverError as { code?: string })?.code === PG_UNIQUE_VIOLATION) {
            throw conflict("Ya existe un turno en esa fecha y hora");
        }
        throw err;
    }

    // Sin await: los mails van en background para no bloquear la respuesta
    const details = { clientName: user.name, serviceName: service.name, date: data.date, time: data.time };
    sendTurnConfirmation(user.email, 'active', details)
        .catch((e) => console.warn("Error al enviar email:", e));
    sendNewAppointmentNotification(details)
        .catch((e) => console.warn("Error al enviar aviso al dueño:", e));

    return toAppointmentDto(saved);
};

export const cancelAppointmentService = async (appointment: Appointment): Promise<AppointmentDto> => {
    if (appointment.status === 'cancelled') throw badRequest("El turno ya estaba cancelado");
    if (appointment.status === 'completed' || isPastSlot(appointment.date, appointment.time)) {
        throw badRequest("No se puede cancelar un turno que ya pasó");
    }

    appointment.status = 'cancelled';
    const updated = await AppointmentModel.save(appointment);

    sendTurnConfirmation(appointment.user.email, 'cancelled', {
        clientName: appointment.user.name,
        serviceName: appointment.category.name,
        date: appointment.date,
        time: appointment.time,
    }).catch((e) => console.warn("Error al enviar email de cancelación:", e));

    return toAppointmentDto(updated);
};

export const blockSlotService = async (date: string, time: string | null, reason?: string) => {
    if (time !== null && !isValidTimeSlot(time)) throw badRequest(TIME_SLOT_ERROR);
    const existing = await BlockedSlotModel.findOne({ where: { date, time: time ?? IsNull() } });
    if (existing) throw conflict("Este horario ya está bloqueado");
    return BlockedSlotModel.save(BlockedSlotModel.create({ date, time, reason: reason ?? null }));
};

export const unblockSlotService = async (id: number) => {
    const blocked = await BlockedSlotModel.findOne({ where: { id } });
    if (!blocked) throw notFound("Bloqueo no encontrado");
    await BlockedSlotModel.remove(blocked);
};

export const getBlockedByDateService = (date: string) =>
    BlockedSlotModel.find({ where: { date } });
