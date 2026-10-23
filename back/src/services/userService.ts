import fs from 'fs/promises';
import path from 'path';
import { IRegisterUserDto } from '../interfaces/IUser';
import { createCredentialsService } from './credentialsService';
import { AppDataSource, UserModel } from '../config/AppDataSources';
import User from '../entities/User';
import { conflict, notFound } from '../utils/HttpError';
import { toUserDto, UserDto } from '../dtos';
import { equalsIgnoreCase } from '../utils/ilike';
import { UPLOADS_DIR } from '../middlewares/uploadMiddleware';

export const getUsersService = async (): Promise<UserDto[]> => {
    const users = await UserModel.find({ order: { name: 'ASC' } });
    return users.map(toUserDto);
};

export const getUserByIdService = async (id: number): Promise<UserDto> => {
    const user = await UserModel.findOne({ where: { id } });
    if (!user) throw notFound("Usuario no encontrado");
    return toUserDto(user);
};

export const getUserByCredentialsId = async (credentialsId: number): Promise<User> => {
    const user = await UserModel.findOne({ where: { credentials: { id: credentialsId } } });
    if (!user) throw notFound("Usuario no encontrado");
    return user;
};

export const registerUserService = async (data: IRegisterUserDto): Promise<UserDto> => {
    const isRegistered = await UserModel.findOne({ where: { email: equalsIgnoreCase(data.email) } });
    if (isRegistered) throw conflict("El email ya está registrado");

    const credentials = await createCredentialsService({ username: data.email, password: data.password });

    // Credencial + usuario en una transacción: si falla uno no queda una credencial huérfana
    const saved = await AppDataSource.transaction(async (manager) => {
        await manager.save(credentials);
        return manager.save(UserModel.create({
            name: data.name,
            email: data.email,
            // Mediodía UTC: la fecha no se corre de día en ninguna zona horaria
            birthdate: new Date(`${data.birthdate}T12:00:00Z`),
            nDni: data.nDni,
            credentials,
            role: 'user',
        }));
    });
    return toUserDto(saved);
};

export const updateProfilePhotoService = async (userId: number, filename: string): Promise<UserDto> => {
    const user = await UserModel.findOne({ where: { id: userId } });
    if (!user) throw notFound("Usuario no encontrado");

    const previous = user.profilePhoto;
    user.profilePhoto = filename;
    await UserModel.save(user);

    // Borramos la foto anterior para no acumular archivos
    if (previous) {
        await fs.unlink(path.join(UPLOADS_DIR, path.basename(previous))).catch(() => {});
    }
    return toUserDto(user);
};
