import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { Payment } from 'src/entities/payments/payment.entity';
import { round } from '../misc/round';

export const resolvePaymentsDto = (
  payments: Payment[],
  startingBalance = 0,
): { entries: PaymentDto[] | null; balance: number } => {
  let balance = startingBalance;

  const entries = payments?.length
    ? payments.map((payment) => {
        if (payment.paymentType === PaymentType.REFUND) {
          balance += payment.amount;
        } else {
          balance -= payment.amount;
        }

        return new PaymentDto({
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
          deletedAt: payment.deletedAt,
          amount: payment.amount,
          paymentType: payment.paymentType,
          paymentProvider: payment.paymentProvider,
          paymentProviderReference: payment.paymentProviderReference,
        });
      })
    : null;

  return { entries, balance: round(balance, 2) };
};
