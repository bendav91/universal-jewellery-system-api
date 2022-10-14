import { applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrderItemDto } from 'src/dtos/orders/order-item.dto';

export const ApiOrderItemDeleteResponse = () => {
  return applyDecorators(
    ApiExtraModels(OrderItemDto),
    ApiAcceptedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(OrderItemDto) }],
      },
    }),
  );
};
