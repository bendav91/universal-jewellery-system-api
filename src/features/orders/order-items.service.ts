import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { Order } from 'src/entities/orders/orders.entity';
import { generateOrderItemNumber } from 'src/utils/generate-order-item-number';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  async getOrderItems(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<OrderItemDto>> {
    const queryBuilder =
      this.orderItemsRepository.createQueryBuilder('orderItem');
    queryBuilder
      .orderBy('orderItem.createdAt', pageOptionsDto.sortOrder)
      .leftJoinAndSelect('orderItem.order', 'order')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const orderItemDtos = entities.map((entity) => {
      return new OrderItemDto({
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
        orderItemNumber: entity.orderItemNumber,
        orderNumber: entity.order.orderNumber,
        status: entity.status,
      });
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(orderItemDtos, pageMetaDto);
  }

  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
    order: Order,
  ): Promise<OrderItemDto> {
    const orderItemNumber = generateOrderItemNumber();

    const savedOrder = await this.orderItemsRepository.save({
      ...createOrderItemDto,
      orderItemNumber,
      order: order,
    });

    return new OrderItemDto({
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
      deletedAt: savedOrder.deletedAt,
      orderItemNumber: savedOrder.orderItemNumber,
      orderNumber: savedOrder.order.orderNumber,
      status: savedOrder.status,
    });
  }

  async deleteOrderItem(orderItemNumber: string): Promise<void> {
    await this.orderItemsRepository.softDelete({ orderItemNumber });
  }

  async restoreOrderItem(orderItemNumber: string): Promise<OrderItemDto> {
    const queryBuilder =
      this.orderItemsRepository.createQueryBuilder('orderItem');

    queryBuilder
      .where('orderItem.orderItemNumber = :orderItemNumber', {
        orderItemNumber,
      })
      .leftJoinAndSelect('orderItem.order', 'order')
      .take(1)
      .update({
        deletedAt: null,
      })
      .execute();

    const { entities } = await queryBuilder.getRawAndEntities();

    return new OrderItemDto({
      createdAt: entities[0].createdAt,
      updatedAt: entities[0].updatedAt,
      deletedAt: entities[0].deletedAt,
      orderItemNumber: entities[0].orderItemNumber,
      orderNumber: entities[0].order.orderNumber,
      status: entities[0].status,
    });
  }
}
