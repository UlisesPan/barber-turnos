import Appointment from './entities/Appointments';
import User from './entities/User';
import { toDateString } from './utils/schedule';

// Lo único que sale de la API sobre un usuario (nunca credenciales)
export const toUserDto = (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthdate: user.birthdate ? toDateString(user.birthdate) : null,
    nDni: user.nDni,
    profilePhoto: user.profilePhoto ?? null,
    role: user.role,
});
export type UserDto = ReturnType<typeof toUserDto>;

export const toAppointmentDto = (a: Appointment) => ({
    id: a.id,
    date: toDateString(a.date),
    time: a.time,
    status: a.status,
    user: a.user ? { id: a.user.id, name: a.user.name } : null,
    category: a.category
        ? { id: a.category.id, name: a.category.name, price: a.category.price, duration: a.category.duration }
        : null,
});
export type AppointmentDto = ReturnType<typeof toAppointmentDto>;
