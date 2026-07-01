import {ICredentials, ICredentialsDto} from '../interfaces/ICredentials';
import {CredentialModel} from '../config/AppDataSources';
import Credentials from '../entities/Credentials';
import { hashPassword, comparePassword } from '../utils/passwordHash';


export const createCredentialsService = async (
    credentialsData: ICredentialsDto
    ) : Promise<Credentials> => {

    const existingCredential = await CredentialModel.findOne({
    where: { username: credentialsData.username },
    relations: { user: true },  
});

if (existingCredential) {
    if (existingCredential.user) {
        throw new Error("El email ya está registrado");
    }
    // Credencial huérfana — la eliminamos y continuamos
    await CredentialModel.remove(existingCredential);
}

    const hashedPassword = await hashPassword(credentialsData.password);

    const newCredentials = await CredentialModel.create({
        username: credentialsData.username,
        password: hashedPassword
    });
        await CredentialModel.save(newCredentials);

    return newCredentials;
};

export const validateCredentialsService = async (credential: ICredentialsDto): Promise<Credentials> => {
     const foundCredential = await CredentialModel.findOne({ where: { 
        username: credential.username
        } 
    });
    
    if (!foundCredential) {
        throw new Error("Usuario o contraseña incorrectos");
    }

    const isPasswordValid = await comparePassword(credential.password, foundCredential.password);
    if (!isPasswordValid) {
        throw new Error("Usuario o contraseña incorrectos");
    }
    
    return foundCredential
};