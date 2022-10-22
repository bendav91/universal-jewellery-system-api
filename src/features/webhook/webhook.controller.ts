import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@Controller('webhook')
@ApiTags('Webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/auth/sync')
  @HttpCode(HttpStatus.OK)
  @ApiException(() => [UnauthorizedException])
  @ApiHeader({
    name: 'x-api-key',
    required: true,
    allowEmptyValue: false,
    schema: {
      default: process.env.WEBHOOK_API_KEY,
    },
  })
  async authSync(
    @Headers('x-api-key')
    reqApiKey: string,
  ) {
    if (this.webhookService.verifyApiKey(reqApiKey)) {
      return 'OK';
    }
  }
}
