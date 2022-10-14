import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

console.log({
  migrationsFolder: typeOrmConfig.migrations,
  entitiesFolder: typeOrmConfig.entities,
});

export const dataSource = new DataSource(typeOrmConfig);
