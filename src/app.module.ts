import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrdersModule } from './features/orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { WebhookModule } from './features/webhook/webhook.module';
import { UsersModule } from './features/users/users.module';
import { PaymentsModule } from './features/payments/payments.module';
import { SwaggerSpecModule } from './features/swagger-spec/swagger-spec.module';
import AuthConfig from './config/auth.config';
import OrdersConfig from './config/orders.config';
import TaxesConfig from './config/taxes.config';
import WebhookConfig from './config/webhook.config';
import SettingsConfig from './config/webhook.config';
import PaymentGatewayConfig from './config/payment-gateway.config';
import NgrokConfig from './config/ngrok.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        PaymentGatewayConfig,
        WebhookConfig,
        AuthConfig,
        OrdersConfig,
        TaxesConfig,
        SettingsConfig,
        NgrokConfig,
      ],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    OrdersModule,
    AuthorisationModule,
    WebhookModule,
    UsersModule,
    PaymentsModule,
    ...(process.env.NODE_ENV !== 'production' ? [SwaggerSpecModule] : []),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
