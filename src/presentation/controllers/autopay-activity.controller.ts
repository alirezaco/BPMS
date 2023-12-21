import { Metadata } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';
import { GrpcService } from '@nestjs/microservices';
import { AutopayActivityUseCase } from 'application/use-cases';
import { MessageEnum } from 'infrastructure/enum';
import {
  AUTOPAY_SERVICE_NAME,
  AutopayServiceController,
  ListAutopayActivityRequest,
  ListAutopayActivityResponse,
  Meta,
} from 'infrastructure/interfaces';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@GrpcService(AUTOPAY_SERVICE_NAME)
export class AutopayActivityController
  implements Pick<AutopayServiceController, 'listAutopayActivity'>
{
  constructor(
    @InjectPinoLogger(AutopayActivityController.name)
    private readonly logger: PinoLogger,
    private readonly autopayActivityUseCase: AutopayActivityUseCase,
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

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async listAutopayActivity(
    request: ListAutopayActivityRequest,
    _?: Metadata,
  ): Promise<ListAutopayActivityResponse> {
    try {
      const data = await this.autopayActivityUseCase.getAutopayActivity(
        request,
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }
}
