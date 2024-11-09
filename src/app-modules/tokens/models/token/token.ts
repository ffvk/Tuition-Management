import { Document } from 'mongoose';
import { Permission } from 'src/app-modules/permissions/models/permission/permission';

export class Token extends Document {
  //   organizationId: string;

  tokenId: string;

  userId: string;

  name: string;

  hash: string;

  expiry: number;

  permissions: Permission[];

  description?: string;

  disabled: boolean;

  timestamp: { createdAt: number; updatedAt: number };
}
