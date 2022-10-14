import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderItemDto } from 'src/dtos/orders/create-order-item.dto';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItem } from 'src/entities/orders/order-item.entity';
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
  ): Promise<PageDto<OrderItem>> {
    const queryBuilder =
      this.orderItemsRepository.createQueryBuilder('orderItem');
    queryBuilder
      .orderBy('orderItem.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItemNumber = generateOrderItemNumber();

    return await this.orderItemsRepository.save({
      ...createOrderItemDto,
      orderItemNumber,
    });
  }

  async deleteOrderItem(orderItemNumber: string): Promise<OrderItem> {
    const queryBuilder = this.orderItemsRepository.createQueryBuilder();

    await queryBuilder
      .update(OrderItem)
      .set({ deletedAt: new Date() })
      .where('orderItemNumber = :orderItemNumber', { orderItemNumber })
      .execute();

    return await this.orderItemsRepository.findOne({
      where: { orderItemNumber },
    });
  }
}
