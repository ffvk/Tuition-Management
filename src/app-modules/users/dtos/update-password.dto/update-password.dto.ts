import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  emailValue: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsString()
  @IsOptional()
  currentPassword: string;

  @IsString()
  @IsOptional()
  passwordOTP: string;
}
