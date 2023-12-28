import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { schemas } from './domain/models';
import { CqrsModule } from '@nestjs/cqrs';
import {
  commandHandlers,
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from 'infrastructure/interfaces';
import { join } from 'path';
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
          password: configService.get<string>('REDIS_PASSWORD'),
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
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: USER_PACKAGE_NAME,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: USER_PACKAGE_NAME,
              channelOptions: {
                'grpc.max_reconnect_backoff_ms': 700,
                'grpc.min_reconnect_backoff_ms': 200,
                'grpc.initial_reconnect_backoff_ms': 400,
              },
              url: configService.get<string>(
                'USER_GRPC_URL',
                '127.0.0.0.1:3019',
              ),
              protoPath: join(
                configService.get<string>('__proto_path'),
                'user.proto',
              ),
              loader: {
                keepCase: true,
              },
            },
          }),
        },
      ],
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
    ...processors,
    ...queues,
  ],
})
export class AutopayModule {}
