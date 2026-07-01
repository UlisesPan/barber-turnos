import {Request, Response} from 'express';
import {CreateAppointmentDto} from '../interfaces/IAppointments';
import { cancelTurnService,
     createTurnService,
      getAllTurnsService,
       getTakenSlotsByDateService,
        getTurnByIdService,
         getTurnsByUserService,
          blockSlotService,
           unblockSlotService,
            getBlockedByDateService
         } from '../services/appointmentsService';


export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await getAllTurnsService(); // Aquí deberías obtener los turnos desde tu servicio o base de datos
        res.status(200).json(appointments);
    }catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al obtener turnos" 
        });
    }
}

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) { res.status(400).json({ message: 'ID inválido' }); return; }
        const appointmentData = await getTurnByIdService(id);
        const requestingUser = res.locals.user;
        if (requestingUser.role !== 'admin' && appointmentData.user?.id !== requestingUser.id) {
            res.status(403).json({ message: 'No tienes permiso para ver este turno' });
            return;
        }
        res.status(200).json(appointmentData);
    }catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener el turno"
        });
    }
}

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentData: Omit<CreateAppointmentDto, 'id'> = req.body;

        if (!appointmentData.userId) {
            res.status(400).json({ message: "El ID del usuario es requerido" });
            return;
        }
        if (!appointmentData.serviceId) {
            res.status(400).json({ message: "El ID del servicio es requerido" });
            return;
        }

        const requestingUser = res.locals.user;
        if (requestingUser.role !== 'admin' && requestingUser.id !== appointmentData.userId) {
            res.status(403).json({ message: 'No puedes crear turnos para otro usuario' });
            return;
        }

        const newAppointment = await createTurnService(appointmentData);
        res.status(201).json(newAppointment);
    }catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al crear el turno"
        });
    }
}

export const getAppointmentsByUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(String(req.params.userId), 10);
        if (isNaN(userId)) { res.status(400).json({ message: 'ID inválido' }); return; }
        const requestingUser = res.locals.user;
        if (requestingUser.role !== 'admin' && requestingUser.id !== userId) {
            res.status(403).json({ message: 'No tienes permiso para ver los turnos de otro usuario' });
            return;
        }
        const appointments = await getTurnsByUserService(userId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener los turnos del usuario"
        });
    }
}

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const date = req.params.date as string;
       const result = await getTakenSlotsByDateService(date);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener los horarios disponibles"
        });
    }
};

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) { res.status(400).json({ message: 'ID inválido' }); return; }
        const requestingUser = res.locals.user;

        const appointment = await getTurnByIdService(id);
        if (requestingUser.role !== 'admin' && appointment.user?.id !== requestingUser.id) {
            res.status(403).json({ message: 'No tienes permiso para cancelar este turno' });
            return;
        }

        const cancelledAppointment = await cancelTurnService(id);
        res.status(200).json({ message: "Turno cancelado exitosamente", appointment: cancelledAppointment });
    }catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : "Error al cancelar el turno"
        });
    }
}


export const blockSlot = async (req: Request, res: Response) => {
  try {
    const { date, time, reason } = req.body;
    if (!date) { res.status(400).json({ message: "La fecha es requerida" }); return; }
    const result = await blockSlotService(date, time ?? null, reason);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Error al bloquear" });
  }
};

export const unblockSlot = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ message: 'ID inválido' }); return; }
    await unblockSlotService(id);
    res.status(200).json({ message: "Slot desbloqueado" });
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : "Error al desbloquear" });
  }
};

export const getBlockedByDate = async (req: Request, res: Response) => {
  try {
    const blocks = await getBlockedByDateService(req.params.date as string);
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener bloqueos" });
  }
};