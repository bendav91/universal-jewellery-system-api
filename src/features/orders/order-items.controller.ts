import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
@ApiTags('Order Items')
export class OrderItemsController {
  constructor(private readonly orderItemService: OrderItemsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(OrderItemDto)
  async getOrderItems(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderItemDto>> {
    return await this.orderItemService.getOrderItems(pageOptionsDto);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createOrderItem(
    @Query() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItemDto> {
    return await this.orderItemService.createOrderItem(createOrderItemDto);
  }

  @Delete('/:orderItemNumber')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteOrderItem(
    @Param('orderItemNumber') orderItemNumber: string,
  ): Promise<void> {
    await this.orderItemService.deleteOrderItem(orderItemNumber);
  }
}
