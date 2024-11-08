import { IRole } from './interfaces';

export class Roles {
  public static readonly SUPER_ROOT: IRole = {
    role: 'SUPER_ROOT',
    description: 'Super root users',
    childRoles: ['SUPER_ROOT', 'TUTOR', 'STUDENT'],
    visible: true,
  };

  public static readonly TUTOR: IRole = {
    role: 'TUTOR',
    description: 'TUTOR users',
    childRoles: ['TUTOR', 'STUDENT'],
    visible: true,
  };

  public static readonly STUDENT: IRole = {
    role: 'STUDENT',
    description: 'STUDENT users',
    childRoles: ['STUDENT'],
    visible: true,
  };
}
