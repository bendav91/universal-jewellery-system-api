import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Auth0User } from 'src/interfaces/auth0-user.interface';
import { mockAuth0User } from 'src/mocks/mock-auth0-user.mock';
import { UsersService } from '../users/users.service';
import { WebhookService } from './webhook.service';

@Controller('webhook')
@ApiTags('Webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/auth/sync')
  @HttpCode(HttpStatus.OK)
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @ApiHeader({
    name: 'x-api-key',
    required: true,
    allowEmptyValue: false,
    schema: {
      default: process.env.WEBHOOK_API_KEY,
    },
  })
  @ApiBody({
    schema: {
      default: { user: mockAuth0User },
    },
  })
  async authSync(
    @Headers('x-api-key')
    reqApiKey: string,
    @Body()
    { user }: { user: Auth0User },
  ) {
    const authorised = this.webhookService.verifyApiKey(reqApiKey);

    if (authorised && user) {
      await this.usersService.saveAuth0User(user);
    } else {
      throw new BadRequestException('Bad Request');
    }
  }
}
