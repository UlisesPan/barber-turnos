import 'reflect-metadata';
import server from './server';
import { PORT } from './config/envs';
import { AppDataSource } from './config/AppDataSources';

AppDataSource.initialize()
    .then(() => {
        console.log('Base de datos conectada.');
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar la base de datos:', err);
        process.exit(1);
    });
