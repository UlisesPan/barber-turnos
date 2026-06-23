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
exports.validateNoConflictAppointment = exports.formatDateToString = exports.getWeekdayErrorMessage = exports.isValidWeekday = exports.getTimeSlotErrorMessage = exports.isValidTimeSlot = exports.timeRegex = void 0;
exports.timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
//Función para validar que el horario esté dentro de los rangos permitidos
const isValidTimeSlot = (time) => {
    const regex = exports.timeRegex;
    if (!regex.test(time))
        return false;
    const [hour] = time.split(':').map(Number);
    const isMorning = hour >= 10 && hour < 13;
    const isAfternoon = hour >= 16 && hour < 20;
    return isMorning || isAfternoon;
};
exports.isValidTimeSlot = isValidTimeSlot;
const getTimeSlotErrorMessage = () => {
    return "Los horarios válidos son de 10:00 a 13:00 o de 16:00 a 20:00.";
};
exports.getTimeSlotErrorMessage = getTimeSlotErrorMessage;
// Usa la cadena YYYY-MM-DD para evitar problemas de zona horaria al construir la fecha
const isValidWeekday = (date) => {
    var _a, _b;
    const dateString = typeof date === 'string'
        ? (_b = (_a = date.match(/^(\d{4}-\d{2}-\d{2})/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''
        : (0, exports.formatDateToString)(date);
    const [year, month, day] = dateString.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const dow = localDate.getDay();
    return dow >= 1 && dow <= 4;
};
exports.isValidWeekday = isValidWeekday;
const getWeekdayErrorMessage = () => {
    return "Solo se pueden agendar turnos de lunes a jueves.";
};
exports.getWeekdayErrorMessage = getWeekdayErrorMessage;
//Convierte una fecha y hora en un timestamp para comparación
const formatDateToString = (date) => {
    if (typeof date === 'string') {
        // Captura YYYY-MM-DD esté o no seguido de T... (ISO string)
        const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match)
            return match[1]; // ✅ Devuelve solo la parte YYYY-MM-DD
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
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
            return false;
        }
        console.log('newDateString:', newDateString);
        console.log('existingDateString:', existingDateString);
        console.log('newTime:', newTime);
        console.log('appointment.time:', appointment.time);
    }
    console.log(`   ✅ No hay conflictos`);
    return true;
});
exports.validateNoConflictAppointment = validateNoConflictAppointment;
