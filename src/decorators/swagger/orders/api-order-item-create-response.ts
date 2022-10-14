import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';

export const ApiOrderItemCreateResponse = () => {
  return applyDecorators(
    ApiExtraModels(OrderItemDto),
    ApiCreatedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(OrderItemDto) }],
      },
    }),
  );
};
