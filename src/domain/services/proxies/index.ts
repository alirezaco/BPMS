import { ApiProxy } from './api.proxy';
import { GrpcProxy } from './grpc.proxy';
import { UserProxy } from './user.proxy';

export * from './api.proxy';
export * from './grpc.proxy';
export * from './user.proxy';

export const proxies = [ApiProxy, GrpcProxy, UserProxy];
