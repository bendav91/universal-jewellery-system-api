import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StripeService } from '../stripe/stripe.service';
import { UsersService } from '../users/users.service';
import { WebhookService } from './webhook.service';
import { Auth0UserRequestDto } from 'src/dtos/auth/auth0-user.dto';

@Controller('webhook')
@ApiTags('Webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly usersService: UsersService,
    private stripeService: StripeService,
  ) {}

  @Post('/auth/sync')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'x-api-key',
    required: true,
    allowEmptyValue: false,
    schema: {
      default: process.env.WEBHOOK_API_KEY,
    },
  })
  @ApiBody({
    type: Auth0UserRequestDto,
  })
  async authSync(
    @Headers('x-api-key')
    reqApiKey: string,
    @Body() auth0User: Auth0UserRequestDto,
  ) {
    const authorised = this.webhookService.verifyApiKey(reqApiKey);

    if (authorised && auth0User) {
      await this.usersService.saveAuth0User(auth0User);
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  @Post('/payment/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Successfully recieved a webhook event sent via POST from Stripe',
  })
  async paymentStripe(@Req() request: RawBodyRequest<Request>) {
    const stripeSignature = request.headers['stripe-signature'];
    await this.stripeService.handleWebhookRequest(
      stripeSignature,
      request.rawBody,
    );
  }
}
