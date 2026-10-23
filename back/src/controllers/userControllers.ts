import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
    getUsersService,
    getUserByIdService,
    registerUserService,
    getUserByCredentialsId,
    updateProfilePhotoService,
} from '../services/userService';
import { validateCredentialsService } from '../services/credentialsService';
import { JWT_SECRET } from '../config/envs';
import { canAccessUser } from '../middlewares/authMiddleware';
import { badRequest, forbidden } from '../utils/HttpError';
import { toUserDto } from '../dtos';

const TOKEN_TTL = '1d';

export const createUser = async (req: Request, res: Response) => {
    const user = await registerUserService(req.body);
    res.status(201).json({ message: "Usuario registrado exitosamente", user });
};

export const getUsers = async (_req: Request, res: Response) => {
    res.json(await getUsersService());
};

export const getUserById = async (_req: Request, res: Response) => {
    const id: number = res.locals.id;
    if (!canAccessUser(res.locals.user, id)) throw forbidden('No tenés permiso para ver este usuario');
    res.json(await getUserByIdService(id));
};

export const loginUser = async (req: Request, res: Response) => {
    const credential = await validateCredentialsService(req.body);
    const user = await getUserByCredentialsId(credential.id);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });
    res.json({ message: 'Login exitoso', token, user: toUserDto(user) });
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
    if (!req.file) throw badRequest("No se envió ninguna imagen");
    const userId: number = res.locals.id;
    if (!canAccessUser(res.locals.user, userId)) throw forbidden('No tenés permiso para modificar esta foto');
    const user = await updateProfilePhotoService(userId, req.file.filename);
    res.json({ message: "Foto actualizada correctamente", profilePhoto: user.profilePhoto });
};
