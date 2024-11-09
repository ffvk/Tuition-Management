import { Schema } from 'mongoose';
import { LogoSchema } from 'src/shared/schemas/logo.schema/logo.schema';

export const HomeworkSchema = new Schema({
  __v: { type: Number, select: false },

  sclassId: {
    type: Schema.Types.ObjectId,
    required: [true, 'MISSING_FIELD__sclassId'],
    ref: 'Sclasses',
  },

  subjectId: {
    type: Schema.Types.ObjectId,
    required: [true, 'MISSING_FIELD__subjectId'],
    ref: 'Subjects',
  },

  title: {
    type: String,
    required: [true, 'MISSING_FIELD__title'],
  },

  description: {
    type: String,
  },

  file: {
    type: LogoSchema,
  },

  dueDate: {
    type: Date,
  },

  timestamp: {
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
});
