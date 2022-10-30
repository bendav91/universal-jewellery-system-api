import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [UsersModule, StripeModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
