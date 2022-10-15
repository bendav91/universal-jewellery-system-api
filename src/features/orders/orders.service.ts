import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/dtos/orders/create-order.dto';
import { OrderDto } from 'src/dtos/orders/order.dto';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { generateOrderNumber } from 'src/utils/generate-order-number';
import { Repository } from 'typeorm';
import { Order } from '../../entities/orders/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getOrders(pageOptionsDto: PageOptionsDto): Promise<PageDto<OrderDto>> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder
      .orderBy('order.createdAt', pageOptionsDto.sortOrder)
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const orderDtos = entities.map((entity) => {
      return new OrderDto({
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
        orderNumber: entity.orderNumber,
        orderItems: entity.orderItems,
        status: entity.status,
      });
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(orderDtos, pageMetaDto);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const newOrder = await this.ordersRepository.save({
      orderNumber: generateOrderNumber(),
      ...createOrderDto,
    });

    return new OrderDto({
      createdAt: newOrder.createdAt,
      updatedAt: newOrder.updatedAt,
      deletedAt: newOrder.deletedAt,
      orderNumber: newOrder.orderNumber,
      orderItems: newOrder.orderItems,
      status: newOrder.status,
    });
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { orderNumber },
    });
  }
}
