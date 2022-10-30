import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/authorisation/auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { ChargePaymentDto } from 'src/dtos/payments/charge-payment.dto';
import { CheckoutLinkDto } from 'src/dtos/payments/checkout-link.dto';
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { StripeService } from '../stripe/stripe.service';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(PaymentDto)
  @Auth('read:payments')
  async getPayments(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PaymentDto>> {
    return await this.paymentsService.getPayments(pageOptionsDto);
  }

  @Get('/:orderNumber')
  @HttpCode(HttpStatus.OK)
  @Auth('read:payments')
  async getPaymentsByOrderNumber(
    @Param('orderNumber') orderNumber: string,
  ): Promise<PaymentDto[]> {
    return await this.paymentsService.getPaymentsByOrderNumber(orderNumber);
  }

  @Post('/:orderNumber')
  @HttpCode(HttpStatus.OK)
  @Auth('create:payments')
  @ApiBody({
    type: ChargePaymentDto,
    schema: {
      example: {
        userId: 'auth0|73205c350b4ed9932f829afb2',
        cancelUrl: 'http://localhost:3000/',
        successUrl: 'http://localhost:3000/',
        orderNumber: 'UJ-7A921E567F',
        lineItems: [
          {
            productName: 'Test Product',
            productId: 1,
            productDescription: 'This is a test product',
            amount: 1256.83,
            quantity: 1,
          },
        ],
      },
    },
  })
  async chargePayment(
    @Body() chargePaymentDto: ChargePaymentDto,
  ): Promise<CheckoutLinkDto> {
    const { url: checkoutUrl } = await this.stripeService.createCheckoutSession(
      chargePaymentDto,
    );
    return new CheckoutLinkDto({ checkoutUrl });
  }
}
