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
exports.cancelAppointment = exports.createAppointment = exports.getAppointmentById = exports.getAllAppointments = void 0;
const appointmentsService_1 = require("../services/appointmentsService");
const getAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield (0, appointmentsService_1.getAllTurnsService)(); // Aquí deberías obtener los turnos desde tu servicio o base de datos
        res.status(200).json(appointments);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener turnos"
        });
    }
});
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const appointmentData = yield (0, appointmentsService_1.getTurnByIdService)(id); // Aquí deberías implementar la lógica para obtener un turno por su ID
        res.status(200).json(appointmentData);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener el turno"
        });
    }
});
exports.getAppointmentById = getAppointmentById;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentData = req.body;
        // Validar que userId está presente en el request
        if (!appointmentData.userId) {
            res.status(400).json({
                message: "El ID del usuario es requerido"
            });
            return;
        }
        if (!appointmentData.serviceId) {
            res.status(400).json({
                message: "El ID del servicio es requerido"
            });
            return;
        }
        const newAppointment = yield (0, appointmentsService_1.createTurnService)(appointmentData); // Aquí deberías implementar la lógica para crear un nuevo turno
        res.status(201).json(newAppointment);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al crear el turno"
        });
    }
});
exports.createAppointment = createAppointment;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const cancelledAppointment = yield (0, appointmentsService_1.cancelTurnService)(id);
        res.status(200).json({ message: "Turno cancelado exitosamente", appointment: cancelledAppointment });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al cancelar el turno"
        });
    }
});
exports.cancelAppointment = cancelAppointment;
