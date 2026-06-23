import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (res.locals.user?.role !== 'admin') {
    res.status(403).json({ message: 'Acceso denegado: solo administradores' });
    return;
  }
  next();
};