import express from 'express';
import helmet from 'helmet';
import router from './routes';
import morgan from 'morgan';
import cors from 'cors';
import { FRONT_URL } from './config/envs';

const server = express();
server.use(helmet());
server.use(cors({ origin: FRONT_URL, credentials: true }));
server.use(
  '/uploads',
  (_req, res, next) => {
    // Permite que el front (otro origen) embeba las imágenes servidas aquí
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static('uploads')
);
server.use(express.json());
server.use(morgan('dev'));
server.use(router);

export default server;