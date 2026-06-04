import server from './server';
import { PORT } from './config/envs';
import { AppDataSource } from './config/AppDataSources';
import { Entity } from "typeorm";
import reflectMetadata from "reflect-metadata";
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
