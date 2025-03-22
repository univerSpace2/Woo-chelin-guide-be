import { UserModule } from '../../../../src/modules/user/user.module';

describe('UserModule', () => {
  it('should be defined', () => {
    expect(new UserModule()).toBeDefined();
  });
});
