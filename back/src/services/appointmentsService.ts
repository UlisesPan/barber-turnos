import {  CreateAppointmentDto, IAppointment  } from '../interfaces/IAppointments';
import {sendTurnConfirmation} from './mailerService';
import Appointment from '../entities/Appointments';
import { AppointmentModel, ServiceModel, UserModel } from '../config/AppDataSources';
import { isValidTimeSlot, getTimeSlotErrorMessage,validateNoConflictAppointment, timeRegex } from '../utils/appointmentValidation';



export const getAllTurnsService = async (): Promise<Appointment[]> => {
    const appointments = await AppointmentModel.find({});
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

const appointmentDate = new Date(turnData.date);
  if (isNaN(appointmentDate.getTime())) {
    throw new Error("Formato de fecha inválido. Usa: YYYY-MM-DD");
  }

   const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw new Error("No se puede agendar un turno en una fecha pasada");
  }

    if (!timeRegex.test(turnData.time)) {
        throw new Error(getTimeSlotErrorMessage());
    }

    if (!isValidTimeSlot(turnData.time)) {
        throw new Error(getTimeSlotErrorMessage());
    }

  const allAppointments = await AppointmentModel.find();

  
  console.log(`📅 Turnos existentes en BD: ${allAppointments.length}`);
  allAppointments.forEach((apt, index) => {
    console.log(
      `   [${index}] Fecha: ${apt.date}, Hora: ${apt.time}, Status: ${apt.status}`
    );
  });

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
    // No lanzar error, el turno ya se creó
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