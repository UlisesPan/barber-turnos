import{ DataSource } from "typeorm"
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./envs"
import Appointment from "../entities/Appointments"
import Credential from "../entities/Credentials"
import User from "../entities/User"
import BlockedSlot from "../entities/BlockedSlot"
import { Category } from "../entities/Category"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    synchronize: process.env.NODE_ENV !== 'production' || process.env.DB_SYNC === 'true',
    // dropSchema: true,
    logging: false,
    entities: [User, Credential, Appointment, Category, BlockedSlot],
    subscribers: [],
    migrations: [],
})


export const UserModel = AppDataSource.getRepository(User);
export const CredentialModel = AppDataSource.getRepository(Credential);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const ServiceModel = AppDataSource.getRepository(Category);
export const BlockedSlotModel = AppDataSource.getRepository(BlockedSlot);