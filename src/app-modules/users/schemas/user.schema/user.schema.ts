import { Schema } from 'mongoose';
import { PasswordSchema } from '../password.schema/password.schema';
import { Roles } from 'src/constants/roles';
import { UserGenderEnum } from 'src/constants/enums';
import { EmailSchema } from '../email.schema/email.schema';

export const UserSchema = new Schema({
  __v: { type: Number, select: false },

  name: {
    type: String,
    required: [true, 'MISSING_FIELD__name'],
  },

  bio: {
    type: String,
  },

  email: {
    type: EmailSchema,
    required: [true, 'MISSING_FIELD__email'],
  },

  gender: {
    type: String,
    enum: {
      values: Object.keys(UserGenderEnum),
      message: 'INVALID_FIELD__gender',
    },
  },

  password: {
    type: PasswordSchema,
    required: [true, 'MISSING_FIELD__password'],
  },

  role: {
    type: String,
    enum: {
      values: Object.keys(Roles),
      message: 'INVALID_FIELD__roles',
    },
    required: [true, 'MISSING_FIELD__role'],
  },

  timestamp: {
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
});
