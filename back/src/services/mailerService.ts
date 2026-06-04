import nodemailer from 'nodemailer';
import {} from '../entities/Appointments';
import { EMAIL_PASS, EMAIL_USER } from '../config/envs';

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