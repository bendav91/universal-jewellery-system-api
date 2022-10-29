import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/authorisation/auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
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
}
