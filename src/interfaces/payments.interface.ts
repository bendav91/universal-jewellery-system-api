import { PaymentDto } from 'src/dtos/payments/payment.dto';

export interface Payments {
  payments: {
    entries: PaymentDto[];
    balance: number;
  };
}
