import { RestrictPermissionsGuard } from './restrict-permissions.guard';

describe('RestrictPermissionsGuard', () => {
  it('should be defined', () => {
    expect(new RestrictPermissionsGuard()).toBeDefined();
  });
});
