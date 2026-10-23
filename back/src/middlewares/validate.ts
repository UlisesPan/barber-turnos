import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { dateParamSchema } from '../schemas';

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const first = Object.values(errors).flat()[0];
        res.status(400).json({ message: first ?? 'Datos inválidos', errors });
        return;
    }
    req.body = result.data;
    next();
};

// Valida y parsea :id (o el nombre de param indicado) como entero positivo
export const parseIdParam = (name = 'id') => (req: Request, res: Response, next: NextFunction): void => {
    const id = Number(req.params[name]);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: 'ID inválido' });
        return;
    }
    res.locals[name] = id;
    next();
};

// Valida :date como YYYY-MM-DD real
export const parseDateParam = (req: Request, res: Response, next: NextFunction): void => {
    const result = dateParamSchema.safeParse(req.params.date);
    if (!result.success) {
        res.status(400).json({ message: 'Fecha inválida. Formato: YYYY-MM-DD' });
        return;
    }
    res.locals.date = result.data;
    next();
};
