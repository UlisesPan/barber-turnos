import { Router } from "express";
import { getAllAppointments,
     getAppointmentById,
      getAvailableSlots,
       createAppointment,
        cancelAppointment,
         getAppointmentsByUser,
        getBlockedByDate,
        blockSlot,
        unblockSlot 
     } from "../controllers/appointmentsControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
const routerAppointments: Router = Router();
// GET /appointments => Obtener el listado de todos los turnos de todos los usuarios.
routerAppointments.get("/", authMiddleware, isAdmin, getAllAppointments);
routerAppointments.get("/user/:userId", authMiddleware, getAppointmentsByUser);
routerAppointments.get("/available/:date", getAvailableSlots);
routerAppointments.get("/blocked/:date", authMiddleware, isAdmin, getBlockedByDate); // ← subir aquí
routerAppointments.get("/:id", getAppointmentById); // ← catch-all, siempre al final
routerAppointments.post("/schedule", createAppointment);
routerAppointments.post("/block", authMiddleware, isAdmin, blockSlot);
routerAppointments.put("/:id/cancel", cancelAppointment);
routerAppointments.delete("/block/:id", authMiddleware, isAdmin, unblockSlot);
export default routerAppointments;