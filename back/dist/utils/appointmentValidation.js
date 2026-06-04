"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNoConflictAppointment = exports.formatDateToString = exports.getTimeSlotErrorMessage = exports.isValidTimeSlot = exports.timeRegex = void 0;
exports.timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
//Función para validar que el horario esté dentro de los rangos permitidos
const isValidTimeSlot = (time) => {
    const regex = exports.timeRegex;
    if (!regex.test(time))
        return false;
    const [hour] = time.split(':').map(Number);
    const isMorning = hour >= 8 && hour < 12;
    const isAfternoon = hour >= 16 && hour < 20;
    return isMorning || isAfternoon;
};
exports.isValidTimeSlot = isValidTimeSlot;
//Mensaje de error para horarios inválidos
const getTimeSlotErrorMessage = () => {
    return "Los horarios válidos son de 8:00 AM a 12:00 PM o de 4:00 PM a 8:00 PM.";
};
exports.getTimeSlotErrorMessage = getTimeSlotErrorMessage;
//Convierte una fecha y hora en un timestamp para comparación
const formatDateToString = (date) => {
    if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        date = new Date(date);
    }
    // ⚠️ MongoDB guarda fechas en UTC, usar métodos locales
    // para evitar desfase de día
    const year = date.getFullYear();
    const month = String(date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.formatDateToString = formatDateToString;
const validateNoConflictAppointment = (existingAppointments, newDate, newTime) => __awaiter(void 0, void 0, void 0, function* () {
    const newDateString = (0, exports.formatDateToString)(newDate);
    for (const appointment of existingAppointments) {
        // Ignorar turnos cancelados
        if (appointment.status === 'cancelled')
            continue;
        // Validar que el horario almacenado sea válido
        if (!(0, exports.isValidTimeSlot)(appointment.time))
            continue;
        // Comparar fecha en formato string (YYYY-MM-DD)
        const existingDateString = (0, exports.formatDateToString)(appointment.date);
        // Si la fecha es igual Y la hora es igual, hay conflicto
        if (existingDateString === newDateString && appointment.time === newTime) {
            console.log(`   ❌ CONFLICTO ENCONTRADO`);
            return false; // ← CONFLICTO ENCONTRADO
        }
    }
    console.log(`   ✅ No hay conflictos`);
    return true; // ← NO HAY CONFLICTO, ES VÁLIDO
});
exports.validateNoConflictAppointment = validateNoConflictAppointment;
