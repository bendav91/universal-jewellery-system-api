import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/dtos/orders/create-order.dto';
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

  async getOrders(pageOptionsDto: PageOptionsDto): Promise<PageDto<Order>> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder
      .orderBy('order.createdAt', pageOptionsDto.sortOrder)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return new Order(
      await this.ordersRepository.save({
        orderNumber: generateOrderNumber(),
        ...createOrderDto,
      }),
    );
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { orderNumber },
    });
  }
}
