export class CreateOrderItemDto implements Readonly<CreateOrderItemDto> {
  constructor(partial: Partial<CreateOrderItemDto>) {
    Object.assign(this, partial);
  }
}
