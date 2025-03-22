import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test } from '@nestjs/testing';
import { PlaceModule } from '../../../../src/modules/place/place.module';

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

jest.mock('../../../../src/modules/place/place.service', () => ({
  PlaceService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateTags: jest.fn(),
    remove: jest.fn(),
    updateAvgRate: jest.fn(),
  })),
}));

describe('PlaceModule', () => {
  it('모듈이 정의되어야 합니다', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PlaceModule],
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
