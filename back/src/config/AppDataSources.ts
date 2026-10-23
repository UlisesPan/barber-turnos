import { DataSource } from "typeorm"
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DB_SYNC, IS_PROD } from "./envs"
import Appointment from "../entities/Appointments"
import Credential from "../entities/Credentials"
import User from "../entities/User"
import BlockedSlot from "../entities/BlockedSlot"
import { Category } from "../entities/Category"
import { UniqueActiveSlot1761200000000 } from "../migrations/1761200000000-UniqueActiveSlot"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: IS_PROD ? { rejectUnauthorized: false } : false,
    // Solo sincroniza si se pide explícitamente (DB_SYNC=true). Nunca por omisión.
    synchronize: DB_SYNC,
    migrationsRun: true,
    logging: false,
    entities: [User, Credential, Appointment, Category, BlockedSlot],
    migrations: [UniqueActiveSlot1761200000000],
})

export const UserModel = AppDataSource.getRepository(User);
export const CredentialModel = AppDataSource.getRepository(Credential);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const CategoryModel = AppDataSource.getRepository(Category);
export const BlockedSlotModel = AppDataSource.getRepository(BlockedSlot);
