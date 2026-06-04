"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentsControllers_1 = require("../controllers/appointmentsControllers");
const routerAppointments = (0, express_1.Router)();
// GET /appointments => Obtener el listado de todos los turnos de todos los usuarios.
routerAppointments.get("/", appointmentsControllers_1.getAllAppointments);
// GET /appointments/:id => Obtener el detalle de un turno específico.
routerAppointments.get("/:id", appointmentsControllers_1.getAppointmentById);
// POST /appointments/schedule => Agendar un nuevo turno.
routerAppointments.post("/schedule", appointmentsControllers_1.createAppointment);
// PUT /appointments/:id/cancel => Cambiar el estatus de un turno a "cancelled".
routerAppointments.put("/:id/cancel", appointmentsControllers_1.cancelAppointment);
exports.default = routerAppointments;
