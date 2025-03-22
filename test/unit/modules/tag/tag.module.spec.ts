import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test } from '@nestjs/testing';
import { TagModule } from '../../../../src/modules/tag/tag.module';

jest.mock('@mikro-orm/nestjs', () => ({
  MikroOrmModule: {
    forFeature: jest.fn().mockReturnValue({
      module: class DynamicModule {},
      providers: [],
    }),
  },
}));

jest.mock('../../../../src/modules/tag/tag.service', () => ({
  TagService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByIds: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('TagModule', () => {
  it('모듈이 정의되어야 합니다', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TagModule],
    })
      .useMocker((token) => {
        if (token === MikroOrmModule) {
          return {};
        }
      })
      .compile();

    expect(moduleRef).toBeDefined();
  });
});
