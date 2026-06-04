"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = exports.AppointmentModel = exports.CredentialModel = exports.UserModel = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const envs_1 = require("./envs");
const Appointments_1 = __importDefault(require("../entities/Appointments"));
const Credentials_1 = __importDefault(require("../entities/Credentials"));
const User_1 = __importDefault(require("../entities/User"));
const Category_1 = require("../entities/Category");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: envs_1.DB_HOST,
    port: envs_1.DB_PORT,
    username: envs_1.DB_USER,
    password: envs_1.DB_PASSWORD,
    database: envs_1.DB_NAME,
    synchronize: true,
    // dropSchema: true,
    logging: false,
    entities: [User_1.default, Credentials_1.default, Appointments_1.default, Category_1.Category],
    subscribers: [],
    migrations: [],
});
exports.UserModel = exports.AppDataSource.getRepository(User_1.default);
exports.CredentialModel = exports.AppDataSource.getRepository(Credentials_1.default);
exports.AppointmentModel = exports.AppDataSource.getRepository(Appointments_1.default);
exports.ServiceModel = exports.AppDataSource.getRepository(Category_1.Category);
