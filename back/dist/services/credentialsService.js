"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentialsService = exports.createCredentialsService = void 0;
const AppDataSources_1 = require("../config/AppDataSources");
const passwordHash_1 = require("../utils/passwordHash");
const createCredentialsService = (credentialsData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCredential = yield AppDataSources_1.CredentialModel.findOne({
        where: { username: credentialsData.username },
    });
    if (existingCredential) {
        throw new Error("Este usuario ya está registrado");
    }
    ;
    const hashedPassword = yield (0, passwordHash_1.hashPassword)(credentialsData.password);
    const newCredentials = yield AppDataSources_1.CredentialModel.create({
        username: credentialsData.username,
        password: hashedPassword
    });
    yield AppDataSources_1.CredentialModel.save(newCredentials);
    return newCredentials;
});
exports.createCredentialsService = createCredentialsService;
const validateCredentialsService = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const foundCredential = yield AppDataSources_1.CredentialModel.findOne({ where: {
            username: credential.username
        }
    });
    if (!foundCredential) {
        throw new Error("Credenciales no encontradas");
    }
    const isPasswordValid = yield (0, passwordHash_1.comparePassword)(credential.password, foundCredential.password);
    if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta");
    }
    return foundCredential;
});
exports.validateCredentialsService = validateCredentialsService;
