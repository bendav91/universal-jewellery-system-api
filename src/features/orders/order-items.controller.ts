import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItemsService } from './order-items.service';
import { OrdersService } from './orders.service';

@Controller('order-items')
@ApiTags('Order Items')
export class OrderItemsController {
  constructor(
    private readonly orderItemService: OrderItemsService,
    private readonly ordersService: OrdersService,
  ) {}

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
  @ApiException(() => [new NotFoundException('Order not found')])
  async createOrderItem(
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItemDto> {
    const order = await this.ordersService.getOrderByOrderNumber(
      createOrderItemDto.orderNumber,
    );

    if (!order) throw new NotFoundException(`Order not found`);

    return await this.orderItemService.createOrderItem(
      createOrderItemDto,
      order,
    );
  }

  @Delete('/:orderItemNumber')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteOrderItem(
    @Param('orderItemNumber') orderItemNumber: string,
  ): Promise<void> {
    await this.orderItemService.deleteOrderItem(orderItemNumber);
  }

  @Put('restore/:orderItemNumber')
  @HttpCode(HttpStatus.OK)
  async restoreOrderItem(
    @Param('orderItemNumber') orderItemNumber: string,
  ): Promise<OrderItemDto> {
    return await this.orderItemService.restoreOrderItem(orderItemNumber);
  }
}
