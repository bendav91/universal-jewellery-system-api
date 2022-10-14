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

    const item = new OrderItem(
      await this.orderItemsRepository.save({
        ...createOrderItemDto,
        orderItemNumber,
      }),
    );

    console.log(item);

    return item;
  }

  async deleteOrderItem(orderItemNumber: string): Promise<void> {
    await this.orderItemsRepository.softDelete({ orderItemNumber });
  }

  async restoreOrderItem(orderItemNumber: string): Promise<OrderItem> {
    this.orderItemsRepository.restore({ orderItemNumber });

    return await this.orderItemsRepository.findOne({
      where: { orderItemNumber },
    });
  }
}
