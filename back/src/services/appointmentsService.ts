import { IsNull } from 'typeorm';
import {  CreateAppointmentDto } from '../interfaces/IAppointments';
import {sendTurnConfirmation} from './mailerService';
import Appointment from '../entities/Appointments';
import { AppointmentModel, ServiceModel, UserModel, BlockedSlotModel } from '../config/AppDataSources';
import { isValidTimeSlot,
   getTimeSlotErrorMessage,
    validateNoConflictAppointment,
     timeRegex,
      isValidWeekday,
       getWeekdayErrorMessage,
        formatDateToString }
         from '../utils/appointmentValidation';



export const getAllTurnsService = async (): Promise<Appointment[]> => {
    const appointments = await AppointmentModel.find({});
    return appointments;
};

export const getTakenSlotsByDateService = async (dateStr: string) => {
  const appointments = await AppointmentModel.find();
  const takenSlots = appointments
    .filter(a => a.status === 'active' && formatDateToString(a.date) === dateStr)
    .map(a => a.time);

  const blockEntries = await BlockedSlotModel.find({ where: { date: dateStr } });
  const isDayBlocked = blockEntries.some(b => b.time === null);
  const blockedSlots = blockEntries.filter(b => b.time !== null).map(b => b.time!);

  return { takenSlots, blockedSlots, isDayBlocked };
};


export const getTurnsByUserService = async (userId: number): Promise<Appointment[]> => {
    const appointments = await AppointmentModel.find({
        where: { user: { id: userId } },
    });
    return appointments;
};

export const getTurnByIdService = async (id: number): Promise<Appointment> => {
    const appointment = await AppointmentModel.findOne({
        where: { id }
    });
    if (!appointment) throw new Error("Turno no encontrado");
    return appointment;
}

export const createTurnService = async (turnData: Omit<CreateAppointmentDto, 'id'>): Promise<Appointment> => {
    // Validar que userId esté presente - NO PUEDE HABER UN TURNO SIN ID DE USUARIO
    if (!turnData.userId) {
        throw new Error("El ID del usuario es requerido para crear un turno");
    }

    const user = await UserModel.findOne({ where: { id: turnData.userId } });
    if (!user) throw new Error("Usuario no encontrado");

    const service = await ServiceModel.findOne({
    where: { id: turnData.serviceId },
  });

  if (!service) throw new Error("Servicio no encontrado");

  const [y, m, d] = turnData.date.split('-').map(Number);
  const appointmentDate = new Date(y, m - 1, d);
  if (isNaN(appointmentDate.getTime())) {
    throw new Error("Formato de fecha inválido. Usa: YYYY-MM-DD");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw new Error("No se puede agendar un turno en una fecha pasada");
  }

  if (!isValidWeekday(turnData.date)) {
    throw new Error(getWeekdayErrorMessage());
  }

    if (!timeRegex.test(turnData.time)) {
        throw new Error(getTimeSlotErrorMessage());
    }

    if (!isValidTimeSlot(turnData.time)) {
        throw new Error(getTimeSlotErrorMessage());
    }
  
const blockEntries = await BlockedSlotModel.find({ where: [
  { date: turnData.date, time: turnData.time },
  { date: turnData.date, time: IsNull() },  // ← IsNull() en vez de null as any
]});
if (blockEntries.length > 0) {
  throw new Error("Este horario no está disponible");
}  
  const allAppointments = await AppointmentModel.find();

  


    const hasConflict = await validateNoConflictAppointment(
      allAppointments,
      appointmentDate,
      turnData.time
    );

    if (!hasConflict) {
        throw new Error("Ya existe un turno en esa fecha y hora");
    }

    const newAppointment = await AppointmentModel.create({
        date: appointmentDate,
        time: turnData.time,
        user: user,
        category: service,
        status: 'active'
    });

    const savedAppointment = await AppointmentModel.save(newAppointment);

   try {
    await sendTurnConfirmation(user.email, 'active');
  } catch (emailError) {
    console.warn("⚠️ Error al enviar email:", emailError);
  }
    return savedAppointment;
};




export const cancelTurnService = async (id: number): Promise<Appointment> => {
  const appointment = await AppointmentModel.findOne({
    where: { id }
  });

  if (!appointment) {
    throw new Error("Turno no encontrado");
  }

  if (appointment.status === 'cancelled') {
    throw new Error("El turno ya estaba cancelado");
  }

  appointment.status = 'cancelled';
  const updatedAppointment = await AppointmentModel.save(appointment);

  // Enviar email de cancelación
   try {
    await sendTurnConfirmation(appointment.user.email, 'cancelled');
  } catch (emailError) {
    console.warn("⚠️ Error al enviar email de cancelación:", emailError);
  }

  return updatedAppointment;
};

export const blockSlotService = async (date: string, time: string | null, reason?: string) => {
  const existing = await BlockedSlotModel.findOne({
  where: { date, time: time !== null ? time : IsNull() }
});
  if (existing) throw new Error("Este slot ya está bloqueado");
  const blocked = BlockedSlotModel.create({ date, time: time ?? null, reason: reason ?? null });
  return await BlockedSlotModel.save(blocked);
};

export const unblockSlotService = async (id: number) => {
  const blocked = await BlockedSlotModel.findOne({ where: { id } });
  if (!blocked) throw new Error("Bloqueo no encontrado");
  await BlockedSlotModel.remove(blocked);
};

export const getBlockedByDateService = async (dateStr: string) => {
  return await BlockedSlotModel.find({ where: { date: dateStr } });
};