import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class UpdateHomeworkDTO {
  @IsMongoId()
  sclassId: string;

  @IsMongoId()
  subjectId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  dueDate: string;
}
