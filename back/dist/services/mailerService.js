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
exports.sendTurnConfirmation = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const envs_1 = require("../config/envs");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: envs_1.EMAIL_USER,
        pass: envs_1.EMAIL_PASS,
    },
});
const sendTurnConfirmation = (toEmail, tipo) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = {
        active: {
            asunto: '✅ Turno confirmado',
            mensaje: 'Tu turno fue reservado exitosamente.',
        },
        cancelled: {
            asunto: '❌ Turno cancelado',
            mensaje: 'Tu turno fue cancelado correctamente.',
        },
        completed: {
            asunto: '✅ Turno completado',
            mensaje: 'Tu turno fue completado exitosamente.',
        }
    };
    const template = templates[tipo];
    if (!template)
        return;
    yield transporter.sendMail({
        from: envs_1.EMAIL_USER,
        to: toEmail,
        subject: template.asunto,
        html: `<p>${template.mensaje}</p>`,
    });
});
exports.sendTurnConfirmation = sendTurnConfirmation;
