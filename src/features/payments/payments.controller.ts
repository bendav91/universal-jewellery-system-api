import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async getPayments(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PaymentDto>> {
    return await this.paymentsService.getPayments(pageOptionsDto);
  }
}
