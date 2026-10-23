import { ICredentialsDto } from '../interfaces/ICredentials';
import { equalsIgnoreCase } from '../utils/ilike';
import { CredentialModel } from '../config/AppDataSources';
import Credentials from '../entities/Credentials';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import { HttpError } from '../utils/HttpError';

// Devuelve la credencial sin guardar: quien llama la persiste (dentro de su transacción)
export const createCredentialsService = async (data: ICredentialsDto): Promise<Credentials> => {
    const existing = await CredentialModel.findOne({
        where: { username: equalsIgnoreCase(data.username) },
        relations: { user: true },
    });

    if (existing) {
        if (existing.user) throw new HttpError(409, "El email ya está registrado");
        // Credencial huérfana (registro anterior a medias): la eliminamos y continuamos
        await CredentialModel.remove(existing);
    }

    const password = await hashPassword(data.password);
    return CredentialModel.create({ username: data.username, password });
};

export const validateCredentialsService = async (data: ICredentialsDto): Promise<Credentials> => {
    // Comparación sin distinguir mayúsculas: hay usuarios viejos registrados con mayúsculas en el email
    const found = await CredentialModel.findOne({
        where: { username: equalsIgnoreCase(data.username) },
        select: { id: true, username: true, password: true },
    });
    const invalid = new HttpError(401, "Usuario o contraseña incorrectos");
    if (!found) throw invalid;
    if (!(await comparePassword(data.password, found.password))) throw invalid;
    return found;
};
