import { Test, TestingModule } from '@nestjs/testing';
import { AutopayModule } from 'autopay.module';

export const initialApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AutopayModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};
