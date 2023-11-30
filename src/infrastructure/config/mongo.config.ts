import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongoConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  const username = configService.get<string>('MONGO_USER');
  const password = configService.get<string>('MONGO_PASS');
  const database = configService.get<string>('MONGO_DB', 'autopay');

  const host = configService.get<string>('MONGO_HOST', '127.0.0.1');
  const query = configService.get<string>('MONGO_QUERY', 'authSource=admin');

  let uri = null;
  if (!username && !password) {
    uri = `mongodb://${host}/${database}?${query}`;
  } else {
    uri = `mongodb://${username}:${password}@${host}/${database}?${query}`;
  }

  return {
    uri: configService.get<string>('MONGO_URI', uri),
  };
};
