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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/authorisation/permissions.guard';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItemsService } from './order-items.service';
import { OrdersService } from './orders.service';
import { Permissions } from 'src/authorisation/permissions.decorator';
import { OrderItemPermissions } from 'src/authorisation/permissions.enum';

@Controller('order-items')
@ApiTags('Order Items')
export class OrderItemsController {
  constructor(
    private readonly orderItemService: OrderItemsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @Permissions(OrderItemPermissions.Read)
  @ApiOAuth2([OrderItemPermissions.Read], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(OrderItemDto)
  @UseGuards(AuthGuard('jwt'))
  async getOrderItems(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderItemDto>> {
    return await this.orderItemService.getOrderItems(pageOptionsDto);
  }

  @Post()
  @Permissions(OrderItemPermissions.Create)
  @ApiOAuth2([OrderItemPermissions.Create], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiException(() => [new NotFoundException('Order not found')])
  @UseGuards(AuthGuard('jwt'))
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
  @Permissions(OrderItemPermissions.Delete)
  @ApiOAuth2([OrderItemPermissions.Delete], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard('jwt'))
  async deleteOrderItem(
    @Param('orderItemNumber') orderItemNumber: string,
  ): Promise<void> {
    await this.orderItemService.deleteOrderItem(orderItemNumber);
  }

  @Put('restore/:orderItemNumber')
  @Permissions(OrderItemPermissions.Update)
  @ApiOAuth2([OrderItemPermissions.Update], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async restoreOrderItem(
    @Param('orderItemNumber') orderItemNumber: string,
  ): Promise<OrderItemDto> {
    return await this.orderItemService.restoreOrderItem(orderItemNumber);
  }
}
