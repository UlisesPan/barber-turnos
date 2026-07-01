import { Router } from "express";
import { createUser, getUsers, getUserById, loginUser, uploadProfilePhoto } from "../controllers/userControllers";
import { upload } from "../middlewares/uploadMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiados intentos. Esperá 15 minutos antes de volver a intentarlo.' },
});

const routerUser: Router = Router();

routerUser.get("/", authMiddleware, isAdmin, getUsers);

routerUser.post("/register", authLimiter, validate(registerSchema), createUser);

routerUser.post("/login", authLimiter, validate(loginSchema), loginUser);

routerUser.put("/:id/photo",
    authMiddleware,
    upload.single("photo"),
    uploadProfilePhoto
);
routerUser.get("/:id", authMiddleware, getUserById);

export default routerUser;
