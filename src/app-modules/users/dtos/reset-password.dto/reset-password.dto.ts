import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  emailValue: string;
}
