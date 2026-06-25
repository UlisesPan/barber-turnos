import axiosInstance from '../api/axiosInstance';

// Helper para no repetir la estructura del header de autenticación en cada llamada
const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ── Lectura ──────────────────────────────────────────────────────────────
// GET /appointments — todos los turnos (vista admin)
export const getAllAppointments = (token) =>
  axiosInstance.get('/appointments', authHeader(token));

// GET /appointments/user/:id — turnos de un cliente
export const getUserAppointments = (userId, token) =>
  axiosInstance.get(`/appointments/user/${userId}`, authHeader(token));

// GET /appointments/available/:date — horarios tomados/bloqueados de una fecha
export const getAvailability = (dateStr) =>
  axiosInstance.get(`/appointments/available/${dateStr}`);

// ── Reserva / cancelación ────────────────────────────────────────────────
// POST /appointments/schedule — crea un turno
export const scheduleAppointment = (payload) =>
  axiosInstance.post('/appointments/schedule', payload);

// PUT /appointments/:id/cancel — cancela un turno
export const cancelAppointment = (id) =>
  axiosInstance.put(`/appointments/${id}/cancel`);

// ── Bloqueos (admin) ─────────────────────────────────────────────────────
// GET /appointments/blocked/:date — slots/día bloqueados (incluye el id del bloqueo)
export const getBlockedSlots = (dateStr, token) =>
  axiosInstance.get(`/appointments/blocked/${dateStr}`, authHeader(token));

// POST /appointments/block — bloquea un slot (time) o el día entero (time: null)
export const blockSlot = (date, time, token) =>
  axiosInstance.post('/appointments/block', { date, time }, authHeader(token));

// DELETE /appointments/block/:id — desbloquea por id de bloqueo
export const unblockSlot = (id, token) =>
  axiosInstance.delete(`/appointments/block/${id}`, authHeader(token));
