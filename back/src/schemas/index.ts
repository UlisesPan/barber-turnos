import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida. Formato: YYYY-MM-DD'),
    nDni: z.coerce.number().int().positive().optional(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Usuario requerido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export const createAppointmentSchema = z.object({
    userId: z.number().int().positive('userId inválido'),
    serviceId: z.number().int().positive('serviceId inválido'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida. Formato: YYYY-MM-DD'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida. Formato: HH:MM'),
});
