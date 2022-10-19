import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT, 10),
      synchronize: process.env.DB_SYNC === 'true',
      username: process.env.DB_USER,
      logging: process.env.DB_LOG === 'true',
      autoLoadEntities: true,
      entities: [`${__dirname}/../src/**/*.entity{.ts, .js}`],
      migrations: [`${__dirname}/../../database/migrations/*{.ts, .js}`],
    };
  },
};

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOG === 'true',
  entities: [`${__dirname}/../../dist/**/*.entity.js`],
  migrations: [`${__dirname}/../../dist/database/migrations/**/*.js`],
};
