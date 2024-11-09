import { IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationEmailDTO {
  @IsNotEmpty()
  @IsString()
  emailValue: string;
}
