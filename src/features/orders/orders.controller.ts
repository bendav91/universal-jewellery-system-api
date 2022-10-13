import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/swagger/api-paginated-response.decorator';
import { OrderDto } from 'src/dtos/order/order.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(OrderDto)
  async getOrders(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    return await this.ordersService.getOrders(pageOptionsDto);
  }
}
