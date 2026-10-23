import { Router } from "express";
import {
    getAllAppointments,
    getAppointmentById,
    getAvailableSlots,
    getSchedule,
    createAppointment,
    cancelAppointment,
    getAppointmentsByUser,
    getBlockedByDate,
    blockSlot,
    unblockSlot,
} from "../controllers/appointmentsControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { validate, parseIdParam, parseDateParam } from '../middlewares/validate';
import { createAppointmentSchema, blockSlotSchema } from '../schemas';

const routerAppointments: Router = Router();

// Públicas
routerAppointments.get("/schedule", getSchedule);
routerAppointments.get("/available/:date", parseDateParam, getAvailableSlots);

// Usuario autenticado (dueño del recurso o admin)
routerAppointments.get("/user/:userId", authMiddleware, parseIdParam('userId'), getAppointmentsByUser);
routerAppointments.post("/schedule", authMiddleware, validate(createAppointmentSchema), createAppointment);

// Admin
routerAppointments.get("/", authMiddleware, isAdmin, getAllAppointments);
routerAppointments.get("/blocked/:date", authMiddleware, isAdmin, parseDateParam, getBlockedByDate);
routerAppointments.post("/block", authMiddleware, isAdmin, validate(blockSlotSchema), blockSlot);
routerAppointments.delete("/block/:id", authMiddleware, isAdmin, parseIdParam(), unblockSlot);

// Por id (al final para no capturar las rutas de arriba)
routerAppointments.get("/:id", authMiddleware, parseIdParam(), getAppointmentById);
routerAppointments.put("/:id/cancel", authMiddleware, parseIdParam(), cancelAppointment);

export default routerAppointments;
