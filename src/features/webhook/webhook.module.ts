import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [UsersModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
