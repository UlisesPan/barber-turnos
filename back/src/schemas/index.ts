import { z } from 'zod';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida. Formato: YYYY-MM-DD')
    .refine((s) => !isNaN(Date.parse(s)), 'Fecha inválida');
const timeStr = z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida. Formato: HH:MM');

export const registerSchema = z.object({
    name: z.string().trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(60, 'El nombre no puede superar los 60 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El nombre solo puede contener letras'),
    email: z.string().trim().toLowerCase().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
    birthdate: dateStr,
    nDni: z.coerce.number().int().min(1_000_000, 'DNI inválido').max(99_999_999, 'DNI inválido'),
});

export const loginSchema = z.object({
    username: z.string().trim().min(1, 'Usuario requerido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export const createAppointmentSchema = z.object({
    userId: z.number().int().positive('userId inválido'),
    serviceId: z.number().int().positive('serviceId inválido'),
    date: dateStr,
    time: timeStr,
});

export const blockSlotSchema = z.object({
    date: dateStr,
    time: timeStr.nullable().optional(),
    reason: z.string().trim().max(200).optional(),
});

export const createCategorySchema = z.object({
    name: z.string().trim().min(1, 'El nombre es requerido').max(80),
    duration: z.coerce.number().int().positive('La duración debe ser mayor a 0'),
    price: z.coerce.number().positive('El precio debe ser mayor a 0'),
    image: z.string().url().optional(),
});

export const updateCategorySchema = z.object({
    price: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

export const dateParamSchema = dateStr;
