import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

console.log({
  ...typeOrmConfig,
});

export const dataSource = new DataSource(typeOrmConfig);
