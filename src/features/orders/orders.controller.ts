import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { CreateOrderDto } from 'src/dtos/orders/create-order.dto';
import { OrderDto } from 'src/dtos/orders/order.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrdersService } from './orders.service';
import { Auth } from 'src/authorisation/auth.decorator';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth('read:orders')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(OrderDto)
  async getOrders(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    return await this.ordersService.getOrders(pageOptionsDto);
  }

  @Post()
  @Auth('create:orders')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return await this.ordersService.createOrder(createOrderDto);
  }
}
