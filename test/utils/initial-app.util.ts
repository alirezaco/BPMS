import { Test, TestingModule } from '@nestjs/testing';
import { AutopayModule } from 'autopay.module';
import { ApiProxy, GrpcProxy, UserProxy } from 'domain/services/proxies';
import { apiProxyMock, grpcProxyMock, userProxyMock } from '../mocks';

export const initialApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AutopayModule],
  })
    .overrideProvider(GrpcProxy)
    .useClass(grpcProxyMock)
    .overrideProvider(ApiProxy)
    .useClass(apiProxyMock)
    .overrideProvider(UserProxy)
    .useClass(userProxyMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};
