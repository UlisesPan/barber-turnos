import { Router, Request, Response } from "express";
import { getAllAppointments, getAppointmentById, createAppointment, cancelAppointment } from "../controllers/appointmentsControllers";
const routerAppointments: Router = Router();

// GET /appointments => Obtener el listado de todos los turnos de todos los usuarios.
routerAppointments.get("/", getAllAppointments);

// GET /appointments/:id => Obtener el detalle de un turno específico.
routerAppointments.get("/:id", getAppointmentById);
// POST /appointments/schedule => Agendar un nuevo turno.
routerAppointments.post("/schedule", createAppointment);
// PUT /appointments/:id/cancel => Cambiar el estatus de un turno a "cancelled".
routerAppointments.put("/:id/cancel", cancelAppointment);

export default routerAppointments;