import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Metadata } from '@grpc/grpc-js';
import {
  AUTOPAY_SERVICE_NAME,
  AutopayServiceController,
  CreateFileRequest,
  CreateFileResponse,
  CreateProcessRequest,
  CreateProcessResponse,
  DeleteProcessRequest,
  DeleteProcessResponse,
  GetProcessRequest,
  GetProcessResponse,
  ListProcessesAdminRequest,
  ListProcessesAdminResponse,
  ListProcessesRequest,
  ListProcessesResponse,
  Meta,
  UpdateProcessRequest,
  UpdateProcessResponse,
} from 'infrastructure/interfaces';
import { HttpStatus } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';
import { ProcessUseCase } from 'application/use-cases';

@GrpcService(AUTOPAY_SERVICE_NAME)
export class ProcessController
  implements
    Pick<
      AutopayServiceController,
      | 'createFile'
      | 'listProcessesAdmin'
      | 'getProcess'
      | 'listProcesses'
      | 'deleteProcess'
      | 'createProcess'
      | 'updateProcess'
    >
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

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async createProcess(
    request: CreateProcessRequest,
    metadata?: Metadata,
  ): Promise<CreateProcessResponse> {
    try {
      const me = metadata?.get('me')[0];

      const process = await this.processUseCase.create(request, me.toString());

      return {
        meta: {
          status: HttpStatus.CREATED,
        },
        data: process,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async updateProcess(
    request: UpdateProcessRequest,
    metadata?: Metadata,
  ): Promise<UpdateProcessResponse> {
    try {
      const me = metadata?.get('me')[0];

      const process = await this.processUseCase.update(request, me.toString());

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: process,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async deleteProcess(
    request: DeleteProcessRequest,
    _?: Metadata,
  ): Promise<DeleteProcessResponse> {
    try {
      const process = await this.processUseCase.delete(request.id);

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: process,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async getProcess(
    request: GetProcessRequest,
    _?: Metadata,
  ): Promise<GetProcessResponse> {
    try {
      const process = await this.processUseCase.getProcess(request.id);

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: process,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async listProcesses(
    request: ListProcessesRequest,
    metadata?: Metadata,
  ): Promise<ListProcessesResponse> {
    try {
      const roles = metadata?.get('roles');

      const processes = await this.processUseCase.getProcesses(
        request,
        roles.map((x) => x.toString()),
      );

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: processes.rows.map((x) => ({
          id: x.id,
          name: x.name,
        })),
      };
    } catch (error) {
      return this.GrpcErrorHandler(error) as any;
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async listProcessesAdmin(
    request: ListProcessesAdminRequest,
    _?: Metadata,
  ): Promise<ListProcessesAdminResponse> {
    try {
      const processes = await this.processUseCase.getProcessesAdmin(request);

      return {
        meta: {
          status: HttpStatus.OK,
        },
        data: processes,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }

  @GrpcMethod(AUTOPAY_SERVICE_NAME)
  async createFile(
    request: CreateFileRequest,
    metadata?: Metadata,
  ): Promise<CreateFileResponse> {
    try {
      const me = metadata?.get('me')[0];

      const file = await this.processUseCase.createFile(request, me.toString());

      return {
        meta: {
          status: HttpStatus.CREATED,
        },
        data: file,
      };
    } catch (error) {
      return this.GrpcErrorHandler(error);
    }
  }
}
