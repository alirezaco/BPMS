import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { schemas } from './domain/models';
import { CqrsModule } from '@nestjs/cqrs';
import {
  commandHandlers,
  crons,
  events,
  processors,
  queryHandlers,
  queues,
} from './application/services';
import { useCases } from './application/use-cases';
import { factories, mappers, repositories } from './domain/services';
import { controllers } from './presentation/controllers';
import { mongoConfig } from './infrastructure/config';
import { proxies } from 'domain/services/proxies';
import { BullModule } from '@nestjs/bull';
import { FAILED_QUEUE, JOBS_QUEUE } from 'infrastructure/constants';
import { ScheduleModule } from '@nestjs/schedule';
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
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),
    }),
    BullModule.registerQueue(
      {
        name: JOBS_QUEUE,
      },
      {
        name: FAILED_QUEUE,
      },
    ),
    ScheduleModule.forRoot(),
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
    ...processors,
    ...crons,
    ...queues,
  ],
})
export class AutopayModule {}
