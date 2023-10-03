import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../user.interface';

export class CreateUserDto {
  @IsNumberString()
  @IsOptional()
  id: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  username: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  companyName: string;

  @IsString()
  companyTaxNumber: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  website: string;
}
