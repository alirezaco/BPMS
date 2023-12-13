import { StepEntity, StepSchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { StepRequest } from 'infrastructure/interfaces';
import { Types } from 'mongoose';
import { GrpcStepMapper } from './grpc-step.mapper';
import { ApiStepMapper } from './api-step.mapper';
import { ComparisonStepMapper } from './comparison-step.mapper';
import { convertToStepType } from 'infrastructure/utils/convert-to-step-type.util';
import { DataParamMapper } from './data-param.mapper';

export class StepMapper implements BaseMapper<StepSchema, StepEntity> {
  constructor(
    private readonly grpcStepMapper: GrpcStepMapper,
    private readonly apiStepMapper: ApiStepMapper,
    private readonly comparisonStepMapper: ComparisonStepMapper,
    private readonly dataParamMapper: DataParamMapper,
  ) {}

  convertEntityToSchema(entity: StepEntity): StepSchema {
    return {
      _id: new Types.ObjectId(entity?.id),
      name: entity?.name,
      type: entity?.type,
      comparison:
        entity?.comparison &&
        this.comparisonStepMapper.convertEntityToSchema(entity?.comparison),
      grpc:
        entity?.grpc && this.grpcStepMapper.convertEntityToSchema(entity?.grpc),
      api: entity?.api && this.apiStepMapper.convertEntityToSchema(entity?.api),
      is_sync: entity?.isSync,
      is_final: entity?.isFinal,
      fail_step: entity?.failStep,
      is_payment: entity?.isPayment,
      payment_param:
        entity?.paymentParam &&
        this.dataParamMapper.convertEntityToSchema(entity?.paymentParam),
    };
  }

  convertSchemaToEntity(schema: StepSchema): StepEntity {
    if (!schema) return;

    return new StepEntity({
      id: schema?._id?.toString(),
      name: schema?.name,
      type: schema?.type,
      comparison:
        schema?.comparison &&
        this.comparisonStepMapper.convertSchemaToEntity(schema?.comparison),
      grpc:
        schema?.grpc && this.grpcStepMapper.convertSchemaToEntity(schema?.grpc),
      api: schema?.api && this.apiStepMapper.convertSchemaToEntity(schema?.api),
      isSync: schema?.is_sync,
      isFinal: schema?.is_final,
      failStep: schema?.fail_step,
      isPayment: schema?.is_payment,
      paymentParam:
        schema?.payment_param &&
        this.dataParamMapper.convertSchemaToEntity(schema?.payment_param),
    });
  }

  convertRequestToEntity(request: Partial<StepRequest>): StepEntity {
    return new StepEntity({
      name: request?.name,
      type: convertToStepType(request?.type),
      comparison: request?.comparison
        ? this.comparisonStepMapper.convertRequestToEntity(request?.comparison)
        : undefined,
      grpc: request?.grpc
        ? this.grpcStepMapper.convertRequestToEntity(request?.grpc)
        : undefined,
      api: request?.api
        ? this.apiStepMapper.convertRequestToEntity(request?.api)
        : undefined,
      isSync: request?.is_sync,
      isFinal: request?.is_final,
      failStep: request?.fail_step,
      isPayment: request?.is_payment,
      paymentParam:
        request?.payment_param &&
        this.dataParamMapper.convertRequestToEntity(request?.payment_param),
    });
  }
}
