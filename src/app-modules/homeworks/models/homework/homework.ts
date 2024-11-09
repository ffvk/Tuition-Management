import { Document } from 'mongoose';
import { Logo } from 'src/shared/models/logo/logo';

export class Homework extends Document {
  sclassId: string;

  subjectId: string;

  title: string;

  description?: string;

  file?: Logo;

  dueDate?: Date;

  timestamp: { createdAt: number; updatedAt: number };
}
