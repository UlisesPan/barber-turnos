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
exports.updateProfilePhotoService = exports.registerUserService = exports.getUserByCredentialsId = exports.getUsersServiceById = exports.getUsersService = void 0;
const credentialsService_1 = require("./credentialsService");
const AppDataSources_1 = require("../config/AppDataSources");
const formatDate_1 = require("../utils/formatDate");
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield AppDataSources_1.UserModel.find();
    return allUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        birthdate: (0, formatDate_1.formatDate)(user.birthdate),
        nDni: user.nDni,
        profilePhoto: user.profilePhoto,
    }));
});
exports.getUsersService = getUsersService;
const getUsersServiceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield AppDataSources_1.UserModel.findOne({ where: { id } });
    if (!user)
        throw new Error("Usuario no encontrado");
    const userDto = {
        name: user.name,
        email: user.email,
        birthdate: (0, formatDate_1.formatDate)(user.birthdate),
        nDni: user.nDni,
        profilePhoto: user.profilePhoto,
        password: "" // No incluir la contraseña en el DTO
    };
    return userDto;
});
exports.getUsersServiceById = getUsersServiceById;
const getUserByCredentialsId = (credentialsId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield AppDataSources_1.UserModel.findOne({ where: { credentials: { id: credentialsId } } });
    if (!user)
        throw new Error("Usuario no encontrado");
    return user;
});
exports.getUserByCredentialsId = getUserByCredentialsId;
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isRegistered = yield AppDataSources_1.UserModel.findOne({ where: { email: userData.email } });
    if (isRegistered) {
        throw new Error("El usuario ya está registrado");
    }
    ;
    const newCredential = yield (0, credentialsService_1.createCredentialsService)({
        username: userData.email,
        password: userData.password
    });
    const newUser = AppDataSources_1.UserModel.create({
        name: userData.name,
        email: userData.email,
        birthdate: (0, formatDate_1.formatDate)(userData.birthdate),
        nDni: userData.nDni || 0,
        credentials: newCredential,
    });
    const savedUser = yield AppDataSources_1.UserModel.save(newUser);
    return savedUser;
});
exports.registerUserService = registerUserService;
const updateProfilePhotoService = (userId, photoPath) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield AppDataSources_1.UserModel.findOne({ where: { id: userId } });
    if (!user)
        throw new Error("Usuario no encontrado");
    user.profilePhoto = photoPath;
    yield AppDataSources_1.UserModel.save(user);
    return (0, exports.getUsersServiceById)(userId);
});
exports.updateProfilePhotoService = updateProfilePhotoService;
