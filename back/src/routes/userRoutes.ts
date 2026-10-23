import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createUser, getUsers, getUserById, loginUser, uploadProfilePhoto } from "../controllers/userControllers";
import { upload } from "../middlewares/uploadMiddleware";
import { authMiddleware, isSelfOrAdmin } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";
import { validate, parseIdParam } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiados intentos. Esperá 15 minutos antes de volver a intentarlo.' },
});

const routerUser: Router = Router();

routerUser.get("/", authMiddleware, isAdmin, getUsers);
routerUser.post("/register", authLimiter, validate(registerSchema), createUser);
routerUser.post("/login", authLimiter, validate(loginSchema), loginUser);
// El permiso se chequea ANTES de multer, para no guardar archivos de requests no autorizados
routerUser.put("/:id/photo", authMiddleware, parseIdParam(), isSelfOrAdmin, upload.single("photo"), uploadProfilePhoto);
routerUser.get("/:id", authMiddleware, parseIdParam(), getUserById);

export default routerUser;
