import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrdersModule } from './features/orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import OrdersConfig from './config/orders.config';
import dotenv from 'dotenv';

dotenv.config({ path: `./src/.env.${process.env.NODE_ENV}` });
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env.${process.env.NODE_ENV}`,
      load: [OrdersConfig],
    }),
    TypeOrmModule.forRoot({
      database: process.env.DB_NAME,
      entities: ['**/**.entity.js'],
      host: process.env.DB_HOST,
      logging: false,
      migrations: ['migrations/**/*.js}'],
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT, 10),
      synchronize: process.env.DB_SYNC === 'true',
      type: 'postgres',
      username: process.env.DB_USER,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
