import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItemType } from 'src/constants/orders/order-item-type';
import { OrderStatus } from 'src/constants/orders/order-status.enum';
import { PaymentStatus } from 'src/constants/orders/payment-status.enum';
import { SortOrder } from 'src/constants/page/sort-order.enum';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';
import { OrderDto } from 'src/dtos/orders/order.dto';
import { PageMetaDto } from 'src/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { TaxDto } from 'src/dtos/taxes/tax.dto';
import { Order } from 'src/entities/orders/orders.entity';
import { MockType } from 'test/mock-type.type';
import { Repository } from 'typeorm';
import { OrderService } from './orders.service';

const repositoryMockFactory = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  createQueryBuilder: jest.fn(() => ({
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getRawAndEntities: jest.fn().mockReturnThis(),
  })),
}));

describe('OrderService', () => {
  let service: OrderService;
  let repositoryMock: MockType<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
    repositoryMock = module.get(getRepositoryToken(Order));
  });

  it('getOrders should return a paginated order DTO', async () => {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = 1;
    pageOptionsDto.take = 2;
    pageOptionsDto.sortOrder = SortOrder.ASC;

    const mockDate = new Date();

    const createQueryBuilderMock = {
      orderBy: jest.fn().mockImplementation(() => createQueryBuilderMock),
      getCount: jest.fn().mockImplementation(() => 2),
      leftJoinAndSelect: jest
        .fn()
        .mockImplementation(() => createQueryBuilderMock),
      skip: jest.fn().mockImplementation(() => createQueryBuilderMock),
      take: jest.fn().mockImplementation(() => createQueryBuilderMock),
      getRawAndEntities: jest.fn().mockImplementation(() => ({
        entities: [
          {
            createdAt: mockDate,
            updatedAt: mockDate,
            deletedAt: null,
            id: 1,
            orderNumber: 'UJ-85AA4F8DB8',
            shippingAddress:
              '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
            notes: 'This is a test order.',
            status: OrderStatus.NEW,
            paymentStatus: PaymentStatus.PAYMENT_PENDING,
            orderItems: [
              {
                createdAt: mockDate,
                updatedAt: mockDate,
                deletedAt: null,
                id: 1,
                orderItemNumber: 'UJ-85AA4F8DB8-1',
                discountAmount: 0,
                grossPrice: 200,
                status: OrderItemType.BESPOKE,
                order: {
                  createdAt: mockDate,
                  updatedAt: mockDate,
                  deletedAt: null,
                  id: 1,
                  orderNumber: 'UJ-85AA4F8DB8',
                  shippingAddress:
                    '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
                  notes: 'This is a test order.',
                  status: OrderStatus.NEW,
                  paymentStatus: PaymentStatus.PAYMENT_PENDING,
                  orderItems: [],
                },
                taxes: [
                  {
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    deletedAt: null,
                    id: 1,
                    description: 'VAT',
                    name: 'VAT',
                    rate: 0.2,
                  },
                ],
              },
            ],
          },
          {
            createdAt: mockDate,
            updatedAt: mockDate,
            deletedAt: null,
            id: 2,
            orderNumber: 'UJ-66AA4F8DBG',
            shippingAddress:
              '2 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
            notes: 'This is a test order 2.',
            status: OrderStatus.NEW,
            paymentStatus: PaymentStatus.PAYMENT_PENDING,
            orderItems: [
              {
                createdAt: mockDate,
                updatedAt: mockDate,
                deletedAt: null,
                id: 3,
                orderItemNumber: 'UJ-87AA4F8DB8-1',
                discountAmount: 20,
                grossPrice: 100.88,
                status: OrderItemType.BESPOKE,
                order: {
                  createdAt: mockDate,
                  updatedAt: mockDate,
                  deletedAt: null,
                  id: 3,
                  orderNumber: 'UJ-66AA4F8DBG',
                  shippingAddress:
                    '2 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
                  notes: 'This is a test order 2.',
                  status: OrderStatus.NEW,
                  paymentStatus: PaymentStatus.PAYMENT_PENDING,
                  orderItems: [],
                },
                taxes: [
                  {
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    deletedAt: null,
                    id: 2,
                    description: 'Gypsy Curse Tax',
                    name: 'GC Tax',
                    rate: 0.6,
                  },
                ],
              },
              {
                createdAt: mockDate,
                updatedAt: mockDate,
                deletedAt: null,
                id: 6,
                orderItemNumber: 'UJ-87AA4F8DB8-1',
                discountAmount: 10,
                grossPrice: 1002.67,
                status: OrderItemType.BESPOKE,
                order: {
                  createdAt: mockDate,
                  updatedAt: mockDate,
                  deletedAt: null,
                  id: 2,
                  orderNumber: 'UJ-66AA4F8DBG',
                  shippingAddress:
                    '2 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
                  notes: 'This is a test order 2.',
                  status: OrderStatus.NEW,
                  paymentStatus: PaymentStatus.PAYMENT_PENDING,
                  orderItems: [],
                },
                taxes: [
                  {
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    deletedAt: null,
                    id: 1,
                    description: 'VAT 2',
                    name: '2 Tax',
                    rate: 0.7,
                  },
                ],
              },
            ],
          },
        ],
      })),
    };

    jest
      .spyOn(repositoryMock, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilderMock);

    const result = await service.getOrders(pageOptionsDto);

    const expected = new PageDto(
      [
        new OrderDto({
          createdAt: mockDate,
          deletedAt: null,
          updatedAt: mockDate,
          orderNumber: 'UJ-85AA4F8DB8',
          orderItems: [
            new OrderItemDto({
              createdAt: mockDate,
              deletedAt: null,
              orderItemNumber: 'UJ-85AA4F8DB8-1',
              updatedAt: mockDate,
              taxes: [
                new TaxDto({
                  createdAt: mockDate,
                  deletedAt: null,
                  updatedAt: mockDate,
                  rate: 0.2,
                  name: 'VAT',
                  description: 'VAT',
                }),
              ],
              orderNumber: 'UJ-85AA4F8DB8',
              prices: {
                gross: 200,
                net: 240,
                discount: 0,
              },
              status: OrderItemType.BESPOKE,
            }),
          ],
          status: OrderStatus.NEW,
          notes: 'This is a test order.',
          paymentStatus: PaymentStatus.PAYMENT_PENDING,
          shippingAddress: '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
          prices: {
            gross: 200,
            discount: 0,
            net: 240,
          },
        }),
        new OrderDto({
          createdAt: mockDate,
          deletedAt: null,
          updatedAt: mockDate,
          orderNumber: 'UJ-66AA4F8DBG',
          orderItems: [
            new OrderItemDto({
              createdAt: mockDate,
              updatedAt: mockDate,
              deletedAt: null,
              orderItemNumber: 'UJ-87AA4F8DB8-1',
              status: OrderItemType.BESPOKE,
              taxes: [
                new TaxDto({
                  createdAt: mockDate,
                  updatedAt: mockDate,
                  deletedAt: null,
                  rate: 0.6,
                  name: 'GC Tax',
                  description: 'Gypsy Curse Tax',
                }),
              ],
              orderNumber: 'UJ-66AA4F8DBG',
              prices: {
                gross: 100.88,
                net: 129.41,
                discount: 20,
              },
            }),
            new OrderItemDto({
              createdAt: mockDate,
              updatedAt: mockDate,
              deletedAt: null,
              orderItemNumber: 'UJ-87AA4F8DB8-1',
              status: OrderItemType.BESPOKE,
              taxes: [
                new TaxDto({
                  createdAt: mockDate,
                  updatedAt: mockDate,
                  deletedAt: null,
                  rate: 0.7,
                  name: '2 Tax',
                  description: 'VAT 2',
                }),
              ],
              orderNumber: 'UJ-66AA4F8DBG',
              prices: {
                gross: 1002.67,
                net: 1687.54,
                discount: 10,
              },
            }),
          ],
          status: OrderStatus.NEW,
          notes: 'This is a test order 2.',
          paymentStatus: PaymentStatus.PAYMENT_PENDING,
          shippingAddress: '2 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
          prices: {
            gross: 1103.55,
            discount: 30,
            net: 1816.95,
          },
        }),
      ],
      new PageMetaDto({
        itemCount: 2,
        pageOptionsDto,
      }),
    );

    expect(result).toEqual(expected);
  });
});
