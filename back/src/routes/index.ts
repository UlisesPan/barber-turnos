import { Router, Request, Response, NextFunction } from "express";

import routerUser from "./userRoutes";
import routerAppointments from "./appointmentsRoutes";
import routerCategories from "./categoriesRoutes";

const router: Router = Router();

router.use("/users", routerUser);
router.use("/appointments", routerAppointments);
router.use("/categories", routerCategories);

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${req.method} ${req.path} —`, err?.message ?? err);

    if (err?.name === 'MulterError' || err?.message?.includes('Formato no permitido')) {
        res.status(400).json({ message: err.message });
        return;
    }

    res.status(500).json({ message: 'Error interno del servidor' });
});

export default router;
