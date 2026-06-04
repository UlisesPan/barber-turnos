import {Request, Response} from 'express';
import {CreateAppointmentDto} from '../interfaces/IAppointments';
import { cancelTurnService, createTurnService, getAllTurnsService, getTurnByIdService, } from '../services/appointmentsService';


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
        const id: number = parseInt(req.params.id as string);
        const appointmentData = await getTurnByIdService(id); // Aquí deberías implementar la lógica para obtener un turno por su ID
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
        
        // Validar que userId está presente en el request
        if (!appointmentData.userId) {
            res.status(400).json({ 
                message: "El ID del usuario es requerido" 
            });
            return;
        }
        if (!appointmentData.serviceId) {
            res.status(400).json({ 
                message: "El ID del servicio es requerido"
            });
            return;
        }

        const newAppointment = await createTurnService(appointmentData); // Aquí deberías implementar la lógica para crear un nuevo turno
        res.status(201).json(newAppointment);
    }catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al crear el turno" 
        });
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id as string);
        const cancelledAppointment = await cancelTurnService(id);
        res.status(200).json({ message: "Turno cancelado exitosamente", appointment: cancelledAppointment });
    }catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al cancelar el turno" 
        });
    }
}
