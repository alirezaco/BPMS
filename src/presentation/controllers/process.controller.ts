import { GrpcService } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Metadata } from '@grpc/grpc-js';
import {
  AUTOPAY_SERVICE_NAME,
  AutopayServiceController,
  CreateProcessRequest,
  CreateProcessResponse,
  Meta,
} from 'infrastructure/interfaces';
import { HttpStatus } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';
import { ProcessUseCase } from 'application/use-cases';
import { ProcessSerializer } from 'presentation/serializers';

@GrpcService(AUTOPAY_SERVICE_NAME)
export class ProcessController
  implements Pick<AutopayServiceController, 'createProcess'>
{
  constructor(
    @InjectPinoLogger(ProcessController.name)
    private readonly logger: PinoLogger,
    private readonly processUseCase: ProcessUseCase,
  ) {}

  private GrpcErrorHandler(error: any): { meta: Meta } {
    const status =
      error.status || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    status === HttpStatus.INTERNAL_SERVER_ERROR && this.logger.debug(error);

    return {
      meta: {
        status: status,
        message: status ? error.message : MessageEnum.INTERNAL_ERROR,
      },
    };
  }

  async createProcess(
    request: CreateProcessRequest,
    metadata?: Metadata,
  ): Promise<CreateProcessResponse> {
    try {
      const me = metadata.get('me')[0];

      const process = await this.processUseCase.create(request, me.toString());

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: new ProcessSerializer(process),
      };
    } catch (error) {
      this.GrpcErrorHandler(error);
    }
  }
}
