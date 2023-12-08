import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { schemas } from './domain/models';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers, events, queryHandlers } from './application/services';
import { useCases } from './application/use-cases';
import { factories, mappers, repositories } from './domain/services';
import { controllers } from './presentation/controllers';
import { mongoConfig } from './infrastructure/config';
import { proxies } from 'domain/services/proxies';

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
  ],
})
export class AutopayModule {}
