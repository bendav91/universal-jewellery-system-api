import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/orders/create-order.dto';
import { OrderDto } from 'src/dtos/orders/order.dto';

export const ApiCreateOrderResponse = () => {
  return applyDecorators(
    ApiExtraModels(CreateOrderDto),
    ApiOkResponse({
      description: 'Successfully created a new order',
      schema: {
        allOf: [{ $ref: getSchemaPath(OrderDto) }],
      },
    }),
  );
};
