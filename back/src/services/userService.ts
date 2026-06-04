import {IUser, IUserDto} from '../interfaces/IUser';
import { createCredentialsService } from './credentialsService';
import { UserModel } from '../config/AppDataSources';
import User from '../entities/User';
import {formatDate} from '../utils/formatDate';


 export const getUsersService = async (): Promise<IUser[]> => {
  const allUsers = await UserModel.find();

    return allUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        birthdate: formatDate(user.birthdate),
        nDni: user.nDni,
        profilePhoto: user.profilePhoto,
    }));
};

export const getUsersServiceById = async (id: number): Promise<IUserDto> => {
    const user = await UserModel.findOne({ where: { id } });
    if (!user) throw new Error("Usuario no encontrado");
    
    const userDto: IUserDto = {
        name: user.name,
        email: user.email,
        birthdate: formatDate(user.birthdate),
        nDni: user.nDni,
        profilePhoto: user.profilePhoto,
        password: "" // No incluir la contraseña en el DTO
    };
    return userDto;
}

export const getUserByCredentialsId = async (credentialsId: number): Promise<User> => {
    const user = await UserModel.findOne({ where: { credentials: { id: credentialsId } } });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
}

export const registerUserService = async (userData: IUserDto): Promise<User> => {

    const isRegistered = await UserModel.findOne({ where: { email: userData.email } });
    if (isRegistered) {
      throw new Error("El usuario ya está registrado");
        };

        const newCredential = await createCredentialsService({
          username: userData.email,
          password: userData.password 
        }
      );

    const newUser = UserModel.create({
        name: userData.name,
        email: userData.email,
        birthdate: formatDate(userData.birthdate),
        nDni: userData.nDni || 0,
        credentials: newCredential,
      
    });
    const savedUser = await UserModel.save(newUser);
    return savedUser;
      

}
 
export const updateProfilePhotoService = async (
  userId: number,
  photoPath: string
): Promise<IUserDto> => {
  const user = await UserModel.findOne({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  user.profilePhoto = photoPath;
  await UserModel.save(user);
  return getUsersServiceById(userId);
};
