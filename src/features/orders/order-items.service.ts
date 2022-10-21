import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { TaxDto } from 'src/dtos/taxes/tax.dto';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { Order } from 'src/entities/orders/orders.entity';
import { generateOrderItemNumber } from 'src/utils/generate-order-item-number';
import { round } from 'src/utils/round';
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
      .leftJoinAndSelect('orderItem.taxes', 'taxes')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const orderItemDtos = entities.map((entity) => {
      const { grossPrice, discountAmount, taxes } = entity;

      let taxMultiplier = 1;

      const taxDtos: TaxDto[] = taxes.map((tax) => {
        taxMultiplier += tax.rate;

        return new TaxDto({
          createdAt: tax.createdAt,
          updatedAt: tax.updatedAt,
          deletedAt: tax.deletedAt,
          rate: tax.rate,
          name: tax.name,
          description: tax.description,
        });
      });

      const gross = round(grossPrice, 2);
      const discount = round(discountAmount, 2);
      const net = round((gross - discount) * taxMultiplier, 2);

      return new OrderItemDto({
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
        orderItemNumber: entity.orderItemNumber,
        orderNumber: entity.order.orderNumber,
        status: entity.status,
        prices: {
          gross: entity.grossPrice,
          discount: entity.discountAmount,
          net,
        },
        taxes: taxDtos,
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

    await queryBuilder.restore().where({ orderItemNumber }).execute();

    queryBuilder
      .where('orderItem.orderItemNumber = :orderItemNumber', {
        orderItemNumber,
      })
      .leftJoinAndSelect('orderItem.order', 'order')
      .take(1);

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
