import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsMongoId()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  gender: string;
}
