import "dotenv/config";

const requiredVars = ['JWT_SECRET', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'] as const;

for (const key of requiredVars) {
    if (!process.env[key]) {
        throw new Error(`[Config] Variable de entorno requerida faltante: ${key}`);
    }
}

export const PORT = process.env.PORT;
export const DB_NAME = process.env.DB_NAME!;
export const DB_USER = process.env.DB_USER!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = Number(process.env.DB_PORT) || 5432;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const OWNER_EMAIL = process.env.OWNER_EMAIL;
export const JWT_SECRET = process.env.JWT_SECRET!;

export const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
