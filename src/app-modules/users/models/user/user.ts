import { UserGenderEnum } from 'src/constants/enums';
import { Email } from '../email/email';
import { Password } from '../password/password';
import { Token } from 'src/app-modules/tokens/models/token/token';
import * as bcrypt from 'bcrypt';

export class User extends Document {
  userId: string;

  name: string;

  bio?: string;

  email: Email;

  gender?: keyof typeof UserGenderEnum = 'OTHERS';

  password: Password;

  wasNew: boolean = true;

  role: string;

  tokens?: Token[];

  timestamp: { createdAt: number; updatedAt: number };

  static async hashPassword(plainPassword: string) {
    return await bcrypt.hash(plainPassword, 10);
  }

  static async comparePassword(toCompare: string, hashed: string) {
    return await bcrypt.compare(toCompare, hashed);
  }
}
