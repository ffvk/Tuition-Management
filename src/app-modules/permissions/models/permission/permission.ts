import { Document } from 'mongoose';
import { PermissionRestrictionEnum } from 'src/constants/enums';

export class Permission extends Document {
  organizationId: string;

  userId: string;

  resourceId: string;

  resourceName: string;

  resourceAction: string;

  restriction: keyof typeof PermissionRestrictionEnum;

  timestamp: { createdAt: number; updatedAt: number };
}
