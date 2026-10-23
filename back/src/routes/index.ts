import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import routerUser from "./userRoutes";
import routerAppointments from "./appointmentsRoutes";
import routerCategories from "./categoriesRoutes";
import { HttpError } from "../utils/HttpError";

const router: Router = Router();

router.use("/users", routerUser);
router.use("/appointments", routerAppointments);
router.use("/categories", routerCategories);

router.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});

// Handler central: errores esperados (HttpError/Multer) con su mensaje; el resto, mensaje genérico
router.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'La imagen no puede superar los 2 MB' : err.message;
        res.status(400).json({ message });
        return;
    }
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({ message: 'JSON inválido' });
        return;
    }

    console.error(`[Error] ${req.method} ${req.path} —`, err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

export default router;
