import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER, OWNER_EMAIL } from '../config/envs';
import { escapeHtml } from '../utils/escapeHtml';
import { AppointmentStatus } from '../entities/Appointments';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

const mailEnabled = Boolean(EMAIL_USER && EMAIL_PASS);

interface AppointmentDetails {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
}

const formatDate = (date: string) => {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

// Todo dato de usuario se escapa antes de ir al HTML
const detailsHtml = (d: AppointmentDetails) => `
  <p><strong>Servicio:</strong> ${escapeHtml(d.serviceName)}</p>
  <p><strong>Fecha:</strong> ${formatDate(d.date)}</p>
  <p><strong>Hora:</strong> ${escapeHtml(d.time)} hs</p>
`;

const TEMPLATES: Record<AppointmentStatus, { subject: string; message: string }> = {
  active: {
    subject: '✅ Turno confirmado',
    message: 'Tu turno fue reservado exitosamente. Te esperamos. ¡Gracias por elegirnos!',
  },
  cancelled: {
    subject: '❌ Turno cancelado',
    message: 'Tu turno fue cancelado correctamente.',
  },
  completed: {
    subject: '✅ Turno completado',
    message: 'Tu turno fue completado. ¡Gracias por visitarnos!',
  },
};

export const sendTurnConfirmation = async (
  toEmail: string,
  status: AppointmentStatus,
  details: AppointmentDetails,
): Promise<void> => {
  if (!mailEnabled) return;
  const template = TEMPLATES[status];
  await transporter.sendMail({
    from: EMAIL_USER,
    to: toEmail,
    subject: template.subject,
    html: `<p>Hola ${escapeHtml(details.clientName)},</p><p>${template.message}</p>${detailsHtml(details)}`,
  });
};

// Aviso al dueño cada vez que reservan un turno
export const sendNewAppointmentNotification = async (details: AppointmentDetails): Promise<void> => {
  if (!mailEnabled || !OWNER_EMAIL) return;
  await transporter.sendMail({
    from: EMAIL_USER,
    to: OWNER_EMAIL,
    subject: '📅 Nuevo turno reservado',
    html: `<h2>Te reservaron un turno</h2>
      <p><strong>Cliente:</strong> ${escapeHtml(details.clientName)}</p>
      ${detailsHtml(details)}`,
  });
};
