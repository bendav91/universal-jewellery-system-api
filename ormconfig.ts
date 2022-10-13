import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: `./src/.env.${process.env.NODE_ENV}` });

const { DB_NAME, DB_PORT, DB_PASS, DB_USER, DB_SYNC, DB_HOST } = process.env;

export const connectionSource = new DataSource({
  database: DB_NAME,
  entities: ['src/**/**.entity{.ts,.js}'],
  host: DB_HOST,
  logging: false,
  migrations: ['src/migrations/**/*{.ts,.js}'],
  password: DB_PASS,
  port: parseInt(DB_PORT, 10),
  synchronize: DB_SYNC === 'true',
  type: 'postgres',
  username: DB_USER,
});
