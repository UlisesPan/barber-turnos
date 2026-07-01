import nodemailer from 'nodemailer';
import {} from '../entities/Appointments';
import { EMAIL_PASS, EMAIL_USER, OWNER_EMAIL } from '../config/envs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendTurnConfirmation = async (
  toEmail: string,
  tipo: 'active' | 'cancelled' | 'completed'
): Promise<void> => {
 const templates: Partial<Record<'active' | 'cancelled' | 'completed', { asunto: string; mensaje: string }>> = {
    active: {
      asunto: '✅ Turno confirmado',
      mensaje: 'Tu turno fue reservado exitosamente, te esperamos en la fecha y hora acordada. Muchas gracias por elegirnos.',
    },
    cancelled: {
      asunto: '❌ Turno cancelado',
      mensaje: 'Tu turno fue cancelado correctamente.',
    },
    completed: {
      asunto: '✅ Turno completado',
      mensaje: 'Tu turno fue completado exitosamente.',
    }
  };
   const template = templates[tipo];

  if (!template) return;
  await transporter.sendMail({
    from: EMAIL_USER,
    to: toEmail,
    subject: template.asunto,
    html: `<p>${template.mensaje}</p>`,
  });
};

// Aviso al dueño/barbero cada vez que le reservan un turno, con los datos del turno.
export const sendNewAppointmentNotification = async (
  details: { clientName: string; serviceName: string; date: string; time: string }
): Promise<void> => {
  // Si no hay mail del dueño configurado, no hacemos nada (igual que el guard de arriba)
  if (!OWNER_EMAIL) return;
  await transporter.sendMail({
    from: EMAIL_USER,
    to: OWNER_EMAIL,
    subject: '📅 Nuevo turno reservado',
    html: `
      <h2>Te reservaron un turno</h2>
      <p><strong>Cliente:</strong> ${details.clientName}</p>
      <p><strong>Servicio:</strong> ${details.serviceName}</p>
      <p><strong>Fecha:</strong> ${details.date}</p>
      <p><strong>Hora:</strong> ${details.time} hs</p>
    `,
  });
};