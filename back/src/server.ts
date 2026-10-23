import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import { FRONT_URL, IS_PROD } from './config/envs';
import { UPLOADS_DIR } from './middlewares/uploadMiddleware';

const server = express();

// Render está detrás de un proxy: sin esto el rate-limit ve a todos con la misma IP
server.set('trust proxy', 1);

server.use(helmet());
server.use(cors({ origin: FRONT_URL }));
server.use(
  '/uploads',
  (_req, res, next) => {
    // Permite que el front (otro origen) embeba las imágenes servidas aquí
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(UPLOADS_DIR, { maxAge: '7d' })
);
server.use(express.json({ limit: '100kb' }));
server.use(morgan(IS_PROD ? 'combined' : 'dev'));

// Endpoint liviano para servicios de keep-alive (no toca la DB).
server.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

server.use(router);

export default server;
