import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTokenDTO {
  //   @IsMongoId()
  //   organizationId: string;

  @IsMongoId()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  expiry: number;

  @IsString()
  @IsOptional()
  description: string;
}
