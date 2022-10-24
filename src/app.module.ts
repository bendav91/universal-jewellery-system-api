import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrdersModule } from './features/orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { WebhookModule } from './features/webhook/webhook.module';
import { UsersModule } from './features/users/users.module';
import AuthConfig from './config/auth.config';
import OrdersConfig from './config/orders.config';
import TaxesConfig from './config/taxes.config';
import WebhookConfig from './config/webhook.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WebhookConfig, AuthConfig, OrdersConfig, TaxesConfig],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    OrdersModule,
    AuthorisationModule,
    WebhookModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
