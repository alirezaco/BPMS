import { Metadata } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { AutopayUseCase } from 'application/use-cases/autopay.use-case';
import { MessageEnum } from 'infrastructure/enum';
import {
  AUTOPAY_SERVICE_NAME,
  AutopayServiceController,
  CreateAutopayRequest,
  CreateAutopayResponse,
  DeleteAutopayRequest,
  DeleteAutopayResponse,
  GetAutopayRequest,
  GetAutopayResponse,
  ListAutopayRequest,
  ListAutopayResponse,
  Meta,
  UpdateAutopayRequest,
  UpdateAutopayResponse,
} from 'infrastructure/interfaces';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AutoPaySerializer } from 'presentation/serializers';

@GrpcService(AUTOPAY_SERVICE_NAME)
export class AutopayController
  implements
    Pick<
      AutopayServiceController,
      | 'listAutopays'
      | 'getAutopay'
      | 'deleteAutopay'
      | 'updateAutopay'
      | 'createAutopay'
    >
{
  constructor(
    @InjectPinoLogger(AutopayController.name)
    private readonly logger: PinoLogger,
    private readonly autopayUseCase: AutopayUseCase,
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
  async createAutopay(
    request: CreateAutopayRequest,
    metadata?: Metadata,
  ): Promise<CreateAutopayResponse> {
    try {
      const me = metadata.get('me')[0];

      const autopay = await this.autopayUseCase.createAutopay(
        request,
        me.toString(),
      );

      return {
        meta: {
          status: HttpStatus.CREATED,
        },
        data: new AutoPaySerializer(autopay),
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async updateAutopay(
    request: UpdateAutopayRequest,
    metadata?: Metadata,
  ): Promise<UpdateAutopayResponse> {
    try {
      const me = metadata.get('me')[0];

      const autopay = await this.autopayUseCase.updateAutopay(
        request,
        me.toString(),
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: new AutoPaySerializer(autopay),
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async deleteAutopay(
    request: DeleteAutopayRequest,
    metadata?: Metadata,
  ): Promise<DeleteAutopayResponse> {
    try {
      const me = metadata.get('me')[0];

      const autopay = await this.autopayUseCase.deleteAutopay(
        request.id,
        me.toString(),
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: new AutoPaySerializer(autopay),
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async getAutopay(
    request: GetAutopayRequest,
    metadata?: Metadata,
  ): Promise<GetAutopayResponse> {
    try {
      const me = metadata.get('me')[0];

      const autopay = await this.autopayUseCase.getAutopay(
        request.id,
        me.toString(),
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: new AutoPaySerializer(autopay),
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async listAutopays(
    request: ListAutopayRequest,
    metadata?: Metadata,
  ): Promise<ListAutopayResponse> {
    try {
      const me = metadata.get('me')[0];

      const res = await this.autopayUseCase.getAllAutopays(
        request,
        me.toString(),
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: {
          count: res.count,
          rows: res.rows.map((x) => ({
            ...x,
            values: x.values.map((y) => new AutoPaySerializer(y)),
          })),
        },
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }
}
