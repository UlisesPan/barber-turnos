import "dotenv/config";

export const PORT = process.env.PORT ;
export const DB_NAME = process.env.DB_NAME ;
export const DB_USER = process.env.DB_USER ;
export const DB_PASSWORD = process.env.DB_PASSWORD ;
export const DB_HOST = process.env.DB_HOST ;
export const DB_PORT = Number(process.env.DB_PORT) ;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS ;
export const JWT_SECRET = process.env.JWT_SECRET ;