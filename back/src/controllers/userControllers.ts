import { Request, Response } from 'express';
import multer from 'multer';
import {IUser, IUserDto, IUserData} from '../interfaces/IUser';
import { getUsersService, getUsersServiceById, registerUserService, getUserByCredentialsId, updateProfilePhotoService } from '../services/userService';
import { validateCredentialsService } from '../services/credentialsService';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/envs';
import User from '../entities/User';

const toSafeUser = (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    birthdate: user.birthdate,
    nDni: user.nDni,
    profilePhoto: user.profilePhoto,
    role: user.role,
});

 export const createUser = async (req: Request, res: Response): Promise<void> => {
    try
        {
            const userData: IUserDto = req.body;
            const newUser = await registerUserService(userData);
            res.status(201).json({ message: "Usuario registrado exitosamente", user: toSafeUser(newUser) });
        }
       catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Error al registrar usuario"
        });
    }
 }

export const getUsers = async (req: Request, res: Response) => {

  try {
    const users: IUser[] = await getUsersService();
  res.status(200).json(users);
}catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Error al obtener usuarios" 
        });
    }
}

export const getUserById = async (req: Request, res: Response) => {
   try {
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) { res.status(400).json({ message: 'ID inválido' }); return; }
        const requestingUser = res.locals.user;
        if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
            res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
            return;
        }
        const user: IUserDto = await getUsersServiceById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : "Usuario no encontrado"
        });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const credential = await validateCredentialsService({ username, password });
        
        const user = await getUserByCredentialsId(credential.id);
        const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET as string,
        { expiresIn: '7d' }
        );

        res.status(200).json({
        message: 'Login exitoso',
        token,
        user: toSafeUser(user),
        });
        
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Credenciales inválidas"
        });
    }
};

export const uploadProfilePhoto = async (
    req: Request & { file?: Express.Multer.File },
  res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No se envió ninguna imagen" });
      return;
    }
    const userId = parseInt(String(req.params.id), 10);
    if (isNaN(userId)) { res.status(400).json({ message: 'ID inválido' }); return; }
    const requestingUser = res.locals.user;
    if (requestingUser.role !== 'admin' && requestingUser.id !== userId) {
      res.status(403).json({ message: 'No tienes permiso para modificar esta foto' });
      return;
    }
    const updatedUser = await updateProfilePhotoService(userId, req.file.filename);

    res.status(200).json({
      message: "Foto actualizada correctamente",
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error al subir la foto",
    });
  }
};