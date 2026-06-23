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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePhoto = exports.loginUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const userService_1 = require("../services/userService");
const credentialsService_1 = require("../services/credentialsService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envs_1 = require("../config/envs");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const newUser = yield (0, userService_1.registerUserService)(userData);
        res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Error al registrar usuario"
        });
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getUsersService)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al obtener usuarios"
        });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const user = yield (0, userService_1.getUsersServiceById)(id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : "Usuario no encontrado"
        });
    }
});
exports.getUserById = getUserById;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const credential = yield (0, credentialsService_1.validateCredentialsService)({ username, password });
        const user = yield (0, userService_1.getUserByCredentialsId)(credential.id);
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, envs_1.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user,
        });
    }
    catch (error) {
        res.status(401).json({
            message: error instanceof Error ? error.message : "Credenciales inválidas"
        });
    }
});
exports.loginUser = loginUser;
const uploadProfilePhoto = (req, // 👈 extendés el tipo
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No se envió ninguna imagen" });
            return;
        }
        const userId = parseInt(req.params.id);
        const updatedUser = yield (0, userService_1.updateProfilePhotoService)(userId, req.file.filename);
        res.status(200).json({
            message: "Foto actualizada correctamente",
            profilePhoto: updatedUser.profilePhoto,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error al subir la foto",
        });
    }
});
exports.uploadProfilePhoto = uploadProfilePhoto;
