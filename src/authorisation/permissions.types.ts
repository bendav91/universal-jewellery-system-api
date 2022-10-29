export type OrderPermissions =
  | 'read:orders'
  | 'create:orders'
  | 'update:orders'
  | 'delete:orders';

export type OrderItemPermissions =
  | 'read:orderitems'
  | 'create:orderitems'
  | 'update:orderitems'
  | 'delete:orderitems';

export type PaymentPermissions =
  | 'read:payments'
  | 'create:payments'
  | 'update:payments'
  | 'delete:payments';

export type ApiPermissions =
  | OrderPermissions
  | OrderItemPermissions
  | PaymentPermissions;
