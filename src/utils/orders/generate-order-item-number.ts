import { v4 as uuid } from 'uuid';

export const generateOrderItemNumber = () => {
  const guid = uuid();
  const orderItemNumber = guid.replace(/-/g, '').slice(0, 10).toUpperCase();
  return `${orderItemNumber}`;
};
