export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  companyName: string;
  companyTaxNumber: string;
  phoneNumber?: string;
  website?: string;
  verified?: boolean;
  isDisabled?: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  USER = 'user',
}
