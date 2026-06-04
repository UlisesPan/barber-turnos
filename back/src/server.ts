import express from 'express';
import router from './routes';
import morgan from 'morgan';

const server = express();
server.use('/uploads', express.static('uploads'));
server.use(express.json());
server.use(morgan('dev'));
server.use(router);

export default server;