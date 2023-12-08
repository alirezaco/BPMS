import { ApiProxy } from './api.proxy';
import { GrpcProxy } from './grpc.proxy';

export * from './api.proxy';
export * from './grpc.proxy';

export const proxies = [ApiProxy, GrpcProxy];
