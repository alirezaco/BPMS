import { StepEntity, StepSchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { StepRequest } from 'infrastructure/interfaces';
import { Types } from 'mongoose';
import { GrpcStepMapper } from './grpc-step.mapper';
import { ApiStepMapper } from './api-step.mapper';
import { ComparisonStepMapper } from './comparison-step.mapper';
import { convertToStepType } from 'infrastructure/utils/convert-to-step-type.util';

export class StepMapper implements BaseMapper<StepSchema, StepEntity> {
  constructor(
    private readonly grpcStepMapper: GrpcStepMapper,
    private readonly apiStepMapper: ApiStepMapper,
    private readonly comparisonStepMapper: ComparisonStepMapper,
  ) {}

  convertEntityToSchema(entity: StepEntity): StepSchema {
    return {
      _id: new Types.ObjectId(entity?.id),
      name: entity?.name,
      type: entity?.type,
      comparison: this.comparisonStepMapper.convertEntityToSchema(
        entity?.comparison,
      ),
      grpc: this.grpcStepMapper.convertEntityToSchema(entity?.grpc),
      api: this.apiStepMapper.convertEntityToSchema(entity?.api),
    };
  }

  convertSchemaToEntity(schema: StepSchema): StepEntity {
    if (!schema) return;

    return new StepEntity({
      id: schema?._id?.toString(),
      name: schema?.name,
      type: schema?.type,
      comparison: this.comparisonStepMapper.convertSchemaToEntity(
        schema?.comparison,
      ),
      grpc: this.grpcStepMapper.convertSchemaToEntity(schema?.grpc),
      api: this.apiStepMapper.convertSchemaToEntity(schema?.api),
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
    });
  }
}
