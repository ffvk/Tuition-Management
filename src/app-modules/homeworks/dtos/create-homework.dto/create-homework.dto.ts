import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateHomeworkDTO {
  @IsMongoId()
  sclassId: string;

  @IsMongoId()
  subjectId: string;

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
