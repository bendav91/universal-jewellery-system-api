import { UserType } from 'src/constants/users/user-type.enum';

export const determineUserType = (
  email: string,
  emailDomains: string,
): UserType => {
  const domains = emailDomains.split(',');
  const isStaff = domains.some((match) => email.includes(match));
  return isStaff ? UserType.STAFF : UserType.CUSTOMER;
};
