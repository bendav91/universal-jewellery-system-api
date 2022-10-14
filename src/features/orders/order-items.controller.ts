import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOrderItemCreateResponse } from 'src/decorators/swagger/orders/api-order-item-create-response';
import { ApiOrderItemDeleteResponse } from 'src/decorators/swagger/orders/api-order-item-delete-response';
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
  @ApiOrderItemCreateResponse()
  async createOrderItem(
    @Query() createOrderItemDto: CreateOrderItemDto,
  ): Promise<CreateOrderItemDto> {
    return await this.orderItemService.createOrderItem(createOrderItemDto);
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOrderItemDeleteResponse()
  async deleteOrderItem(
    @Query() orderItemNumber: string,
  ): Promise<OrderItemDto> {
    return await this.orderItemService.deleteOrderItem(orderItemNumber);
  }
}
