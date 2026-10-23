import axiosInstance from '../api/axiosInstance';

// El token lo agrega el interceptor de axiosInstance

// GET /appointments — todos los turnos (admin)
export const getAllAppointments = () => axiosInstance.get('/appointments');

// GET /appointments/user/:id — turnos de un cliente
export const getUserAppointments = (userId) => axiosInstance.get(`/appointments/user/${userId}`);

// GET /appointments/available/:date — horarios tomados/bloqueados de una fecha
export const getAvailability = (dateStr) => axiosInstance.get(`/appointments/available/${dateStr}`);

// POST /appointments/schedule — crea un turno
export const scheduleAppointment = (payload) => axiosInstance.post('/appointments/schedule', payload);

// PUT /appointments/:id/cancel — cancela un turno
export const cancelAppointment = (id) => axiosInstance.put(`/appointments/${id}/cancel`);

// GET /appointments/blocked/:date — bloqueos de una fecha (admin)
export const getBlockedSlots = (dateStr) => axiosInstance.get(`/appointments/blocked/${dateStr}`);

// POST /appointments/block — bloquea un horario (time) o el día entero (time: null)
export const blockSlot = (date, time) => axiosInstance.post('/appointments/block', { date, time });

// DELETE /appointments/block/:id — desbloquea por id de bloqueo
export const unblockSlot = (id) => axiosInstance.delete(`/appointments/block/${id}`);
