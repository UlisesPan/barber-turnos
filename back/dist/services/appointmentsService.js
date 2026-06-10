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
exports.cancelTurnService = exports.createTurnService = exports.getTurnByIdService = exports.getAllTurnsService = void 0;
const mailerService_1 = require("./mailerService");
const AppDataSources_1 = require("../config/AppDataSources");
const appointmentValidation_1 = require("../utils/appointmentValidation");
const getAllTurnsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield AppDataSources_1.AppointmentModel.find({});
    return appointments;
});
exports.getAllTurnsService = getAllTurnsService;
const getTurnByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield AppDataSources_1.AppointmentModel.findOne({
        where: { id }
    });
    if (!appointment)
        throw new Error("Turno no encontrado");
    return appointment;
});
exports.getTurnByIdService = getTurnByIdService;
const createTurnService = (turnData) => __awaiter(void 0, void 0, void 0, function* () {
    // Validar que userId esté presente - NO PUEDE HABER UN TURNO SIN ID DE USUARIO
    if (!turnData.userId) {
        throw new Error("El ID del usuario es requerido para crear un turno");
    }
    const user = yield AppDataSources_1.UserModel.findOne({ where: { id: turnData.userId } });
    if (!user)
        throw new Error("Usuario no encontrado");
    const service = yield AppDataSources_1.ServiceModel.findOne({
        where: { id: turnData.serviceId },
    });
    if (!service)
        throw new Error("Servicio no encontrado");
    const appointmentDate = new Date(turnData.date);
    if (isNaN(appointmentDate.getTime())) {
        throw new Error("Formato de fecha inválido. Usa: YYYY-MM-DD");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
        throw new Error("No se puede agendar un turno en una fecha pasada");
    }
    if (!appointmentValidation_1.timeRegex.test(turnData.time)) {
        throw new Error((0, appointmentValidation_1.getTimeSlotErrorMessage)());
    }
    if (!(0, appointmentValidation_1.isValidTimeSlot)(turnData.time)) {
        throw new Error((0, appointmentValidation_1.getTimeSlotErrorMessage)());
    }
    const allAppointments = yield AppDataSources_1.AppointmentModel.find();
    const hasConflict = yield (0, appointmentValidation_1.validateNoConflictAppointment)(allAppointments, appointmentDate, turnData.time);
    if (!hasConflict) {
        throw new Error("Ya existe un turno en esa fecha y hora");
    }
    const newAppointment = yield AppDataSources_1.AppointmentModel.create({
        date: appointmentDate,
        time: turnData.time,
        user: user,
        category: service,
        status: 'active'
    });
    const savedAppointment = yield AppDataSources_1.AppointmentModel.save(newAppointment);
    try {
        yield (0, mailerService_1.sendTurnConfirmation)(user.email, 'active');
    }
    catch (emailError) {
        console.warn("⚠️ Error al enviar email:", emailError);
    }
    return savedAppointment;
});
exports.createTurnService = createTurnService;
const cancelTurnService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield AppDataSources_1.AppointmentModel.findOne({
        where: { id }
    });
    if (!appointment) {
        throw new Error("Turno no encontrado");
    }
    if (appointment.status === 'cancelled') {
        throw new Error("El turno ya estaba cancelado");
    }
    appointment.status = 'cancelled';
    const updatedAppointment = yield AppDataSources_1.AppointmentModel.save(appointment);
    // Enviar email de cancelación
    try {
        yield (0, mailerService_1.sendTurnConfirmation)(appointment.user.email, 'cancelled');
    }
    catch (emailError) {
        console.warn("⚠️ Error al enviar email de cancelación:", emailError);
    }
    return updatedAppointment;
});
exports.cancelTurnService = cancelTurnService;
