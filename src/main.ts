import { join } from 'path';
process.env.__proto_path = join(__dirname, 'infrastructure/proto/');

import { NestFactory } from '@nestjs/core';
import { AutopayModule } from './autopay.module';
import { Logger, PinoLogger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GRPC_PORT } from './infrastructure/config';
import { AUTOPAY_PACKAGE_NAME } from './infrastructure/interfaces';

async function bootstrap() {
  //initial logger
  const pinoLogger = new PinoLogger({
    pinoHttp: { crlf: true, level: process.env.LOG_LEVEL ?? 'debug' },
  });
  pinoLogger.setContext('Main');
  const logger = new Logger(pinoLogger, { renameContext: 'context' });

  //create app
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AutopayModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${GRPC_PORT}`,
        package: AUTOPAY_PACKAGE_NAME,
        protoPath: join(process.env.__proto_path, 'autopay.proto'),
        loader: {
          keepCase: true,
        },
      },
    },
  );

  //set logger
  app.useLogger(app.get(Logger));

  //start app
  await app.listen();

  logger.log(`Autopay service is running. :D`);
  logger.log(`GRPC is running on port: ${GRPC_PORT}`);
}
bootstrap();
