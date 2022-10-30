import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
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
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
  @ApiException(() => [
    new BadRequestException('Order number is required'),
    new NotFoundException('Order not found'),
  ])
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
  @ApiException(() => [
    new NotFoundException('Order not found'),
    new NotFoundException('User not found'),
    new NotFoundException('No payment gateway id for user'),
    new BadRequestException('Error returned from payment provider'),
  ])
  async chargePayment(
    @Body() chargePaymentDto: ChargePaymentDto,
  ): Promise<{ checkoutUrl: string }> {
    const { url } = await this.paymentsService.createCheckoutSession(
      chargePaymentDto,
    );
    return { checkoutUrl: url };
  }
}
