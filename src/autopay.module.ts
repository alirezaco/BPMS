import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { schemas } from './domain/models';
import { CqrsModule } from '@nestjs/cqrs';
import {
  commandHandlers,
  events,
  queryHandlers,
  standalones,
} from './application/services';
import { useCases } from './application/use-cases';
import { factories, mappers, repositories } from './domain/services';
import { controllers } from './presentation/controllers';
import { mongoConfig } from './infrastructure/config';
import { proxies } from 'domain/services/proxies';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`,
      ignoreEnvFile: process.env.ENV_FILES
        ? process.env.ENV_FILES !== 'true'
        : false,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'debug'),
          crlf: true,
        },
        renameContext: 'context',
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongoConfig,
    }),
    MongooseModule.forFeature(schemas),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot({
      global: true,
      maxListeners: 1,
      ignoreErrors: true,
    }),
  ],
  controllers: [...controllers],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...useCases,
    ...factories,
    ...mappers,
    ...repositories,
    ...events,
    ...proxies,
    ...standalones,
  ],
})
export class AutopayModule {}
