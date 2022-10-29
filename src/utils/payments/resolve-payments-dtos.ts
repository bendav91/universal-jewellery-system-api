import { PaymentType } from 'src/constants/payments/payment-type.enum';
import { PaymentDto } from 'src/dtos/payments/payment.dto';
import { Payment } from 'src/entities/payments/payment.entity';

export const resolvePaymentsDto = (
  payments: Payment[],
  startingBalance = 0,
): { entries: PaymentDto[]; balance: number } => {
  let balance = startingBalance;

  const entries = payments.map((payment) => {
    if (payment.paymentType === PaymentType.REFUND) {
      balance += payment.amount;
    } else {
      balance -= payment.amount;
    }

    return new PaymentDto({
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      deletedAt: payment.deletedAt,
      paymentId: payment.paymentId,
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentProvider: payment.paymentProvider,
      paymentProviderReference: payment.paymentProviderReference,
    });
  });

  return { entries, balance };
};
