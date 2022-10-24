import { UserType } from 'src/constants/users/user-type.enum';
import dotenv from 'dotenv';

dotenv.config();

export const determineUserType = (email: string): UserType => {
  const staffEmailDomains = process.env.STAFF_EMAIL_DOMAINS.split(',');
  const isStaff = staffEmailDomains.some((match) => email.includes(match));
  return isStaff ? UserType.STAFF : UserType.CUSTOMER;
};
