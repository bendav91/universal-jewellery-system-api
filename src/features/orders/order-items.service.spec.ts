import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SortOrder } from 'src/constants/page/sort-order.enum';
import { PageOptionsDto } from 'src/dtos/page/page-options.dto';
import { PageDto } from 'src/dtos/page/page.dto';
import { OrderItem } from 'src/entities/orders/order-item.entity';
import { MockType } from 'test/mock-type.type';
import { Repository } from 'typeorm';
import { OrderItemsService } from './order-items.service';

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

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let repositoryMock: MockType<Repository<OrderItem>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<OrderItemsService>(OrderItemsService);
    repositoryMock = module.get(getRepositoryToken(OrderItem));
  });

  it('getOrderItems should return a paginated order DTO', async () => {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = 1;
    pageOptionsDto.take = 2;
    pageOptionsDto.sortOrder = SortOrder.ASC;

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
            createdAt: '2022-10-21T06:41:49.723Z',
            updatedAt: '2022-10-21T06:41:49.723Z',
            deletedAt: null,
            id: 1,
            orderItemNumber: '1BF20E73D5',
            status: 'MADE_TO_ORDER',
            grossPrice: 1245.77,
            discountAmount: 120.55,
            order: {
              createdAt: '2022-10-21T06:26:39.512Z',
              updatedAt: '2022-10-21T06:26:39.512Z',
              deletedAt: null,
              id: 1,
              orderNumber: 'UJ-85AA4F8DB8',
              shippingAddress:
                '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
              notes: 'This is a test order.',
              status: 'NEW',
              paymentStatus: 'PAYMENT_PENDING',
            },
            taxes: [
              {
                createdAt: '2022-10-21T18:55:16.299Z',
                updatedAt: '2022-10-21T18:55:16.299Z',
                deletedAt: null,
                id: 1,
                name: 'VAT',
                rate: 0.2,
                description: 'UK VAT Rate',
              },
              {
                createdAt: '2022-10-21T19:37:23.859Z',
                updatedAt: '2022-10-21T19:37:23.859Z',
                deletedAt: null,
                id: 2,
                name: 'GYP',
                rate: 0.5,
                description: 'Gypsy Curse Tax',
              },
            ],
          },
          {
            createdAt: '2022-10-24T17:29:37.979Z',
            updatedAt: '2022-10-24T17:29:37.979Z',
            deletedAt: null,
            id: 2,
            orderItemNumber: '2BF20E73D2',
            status: 'MADE_TO_ORDER',
            grossPrice: 9000,
            discountAmount: 467,
            order: {
              createdAt: '2022-10-21T06:26:39.512Z',
              updatedAt: '2022-10-21T06:26:39.512Z',
              deletedAt: null,
              id: 1,
              orderNumber: 'UJ-85AA4F8DB8',
              shippingAddress:
                '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU',
              notes: 'This is a test order.',
              status: 'NEW',
              paymentStatus: 'PAYMENT_PENDING',
            },
            taxes: [],
          },
        ],
      })),
    };

    jest
      .spyOn(repositoryMock, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilderMock);

    const result = await service.getOrderItems(pageOptionsDto);

    const expected = new PageDto(
      [
        {
          createdAt: '2022-10-21T06:41:49.723Z',
          updatedAt: '2022-10-21T06:41:49.723Z',
          deletedAt: null,
          orderItemNumber: '1BF20E73D5',
          status: 'MADE_TO_ORDER',
          taxes: [
            {
              createdAt: '2022-10-21T18:55:16.299Z',
              updatedAt: '2022-10-21T18:55:16.299Z',
              deletedAt: null,
              rate: 0.2,
              name: 'VAT',
              description: 'UK VAT Rate',
            },
            {
              createdAt: '2022-10-21T19:37:23.859Z',
              updatedAt: '2022-10-21T19:37:23.859Z',
              deletedAt: null,
              rate: 0.5,
              name: 'GYP',
              description: 'Gypsy Curse Tax',
            },
          ],
          orderNumber: 'UJ-85AA4F8DB8',
          prices: {
            gross: 1245.77,
            net: 1912.87,
            discount: 120.55,
          },
        },
        {
          createdAt: '2022-10-24T17:29:37.979Z',
          updatedAt: '2022-10-24T17:29:37.979Z',
          deletedAt: null,
          orderItemNumber: '2BF20E73D2',
          status: 'MADE_TO_ORDER',
          taxes: [],
          orderNumber: 'UJ-85AA4F8DB8',
          prices: {
            gross: 9000,
            net: 8533,
            discount: 467,
          },
        },
      ],
      {
        page: 1,
        take: 2,
        itemCount: 2,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    );

    expect(result).toEqual(expected);
  });
});
