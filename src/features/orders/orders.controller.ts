import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/swagger/pagination/api-paginated-response.decorator';
import { CreateOrderDto } from 'src/dtos/orders/create-order.dto';
import { OrderDto } from 'src/dtos/orders/order.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { Permissions } from 'src/authorisation/permissions.decorator';
import { OrdersService } from './orders.service';
import { PermissionsGuard } from 'src/authorisation/permissions.guard';
import { OrderPermissions } from 'src/authorisation/permissions.enum';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Permissions(OrderPermissions.Read)
  @ApiOAuth2([OrderPermissions.Read], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(OrderDto)
  async getOrders(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderDto>> {
    return await this.ordersService.getOrders(pageOptionsDto);
  }

  @Post()
  @Permissions(OrderPermissions.Create)
  @ApiOAuth2([OrderPermissions.Create], 'Auth0')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return await this.ordersService.createOrder(createOrderDto);
  }
}
