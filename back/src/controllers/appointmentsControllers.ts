import { Request, Response } from 'express';
import {
    cancelAppointmentService,
    createAppointmentService,
    getAllAppointmentsService,
    getTakenSlotsByDateService,
    getAppointmentEntityById,
    getAppointmentsByUserService,
    blockSlotService,
    unblockSlotService,
    getBlockedByDateService,
} from '../services/appointmentsService';
import { canAccessUser } from '../middlewares/authMiddleware';
import { forbidden } from '../utils/HttpError';
import { toAppointmentDto } from '../dtos';
import { SCHEDULE } from '../utils/schedule';

// Express 5 propaga los errores de los handlers async al error handler central:
// los controllers no necesitan try/catch.

export const getAllAppointments = async (_req: Request, res: Response) => {
    res.json(await getAllAppointmentsService());
};

export const getAppointmentById = async (_req: Request, res: Response) => {
    const appointment = await getAppointmentEntityById(res.locals.id);
    if (!canAccessUser(res.locals.user, appointment.user.id)) throw forbidden('No tenés permiso para ver este turno');
    res.json(toAppointmentDto(appointment));
};

export const createAppointment = async (req: Request, res: Response) => {
    if (!canAccessUser(res.locals.user, req.body.userId)) throw forbidden('No podés crear turnos para otro usuario');
    res.status(201).json(await createAppointmentService(req.body));
};

export const getAppointmentsByUser = async (_req: Request, res: Response) => {
    const userId: number = res.locals.userId;
    if (!canAccessUser(res.locals.user, userId)) throw forbidden('No tenés permiso para ver los turnos de otro usuario');
    res.json(await getAppointmentsByUserService(userId));
};

export const getAvailableSlots = async (_req: Request, res: Response) => {
    res.json(await getTakenSlotsByDateService(res.locals.date));
};

export const getSchedule = (_req: Request, res: Response) => {
    res.json(SCHEDULE);
};

export const cancelAppointment = async (_req: Request, res: Response) => {
    const appointment = await getAppointmentEntityById(res.locals.id);
    if (!canAccessUser(res.locals.user, appointment.user.id)) throw forbidden('No tenés permiso para cancelar este turno');
    const cancelled = await cancelAppointmentService(appointment);
    res.json({ message: 'Turno cancelado exitosamente', appointment: cancelled });
};

export const blockSlot = async (req: Request, res: Response) => {
    const { date, time, reason } = req.body;
    res.status(201).json(await blockSlotService(date, time ?? null, reason));
};

export const unblockSlot = async (_req: Request, res: Response) => {
    await unblockSlotService(res.locals.id);
    res.json({ message: 'Horario desbloqueado' });
};

export const getBlockedByDate = async (_req: Request, res: Response) => {
    res.json(await getBlockedByDateService(res.locals.date));
};
