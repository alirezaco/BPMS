import { Test, TestingModule } from '@nestjs/testing';
import { AutopayModule } from 'autopay.module';
import { ApiProxy, GrpcProxy } from 'domain/services/proxies';
import { apiProxyMock, grpcProxyMock } from '../mocks';

export const initialApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AutopayModule],
  })
    .overrideProvider(GrpcProxy)
    .useClass(grpcProxyMock)
    .overrideProvider(ApiProxy)
    .useClass(apiProxyMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};
