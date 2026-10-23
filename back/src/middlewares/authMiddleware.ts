import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/envs';

export interface AuthUser {
  id: number;
  role: 'user' | 'admin';
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (typeof decoded.id !== 'number' || (decoded.role !== 'user' && decoded.role !== 'admin')) {
      throw new Error('payload inválido');
    }
    res.locals.user = { id: decoded.id, role: decoded.role } satisfies AuthUser;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Admin o dueño del recurso
export const canAccessUser = (requester: AuthUser, userId: number) =>
  requester.role === 'admin' || requester.id === userId;

// Corta antes de procesar el request si no es admin ni dueño de :id (requiere parseIdParam antes)
export const isSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!canAccessUser(res.locals.user, res.locals.id)) {
    res.status(403).json({ message: 'No tenés permiso sobre este usuario' });
    return;
  }
  next();
};
