"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado: solo administradores' });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
