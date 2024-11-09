import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserGenderEnum, UserRoleEnum } from 'src/constants/enums';
import { EmailDTO } from '../email.dto/email.dto';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EmailDTO)
  email: EmailDTO;

  @IsEnum(UserGenderEnum)
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: string;
}
