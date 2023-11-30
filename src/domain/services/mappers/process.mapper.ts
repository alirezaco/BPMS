import { CreateProcessRequest } from 'infrastructure/interfaces';
import { BaseMapper } from './base.mapper';
import { ProcessEntity, ProcessSchema } from 'domain/models';
import { StepMapper } from './step.mapper';
import { Types } from 'mongoose';
import { convertToPeriod } from 'infrastructure/utils';

export class ProcessMapper implements BaseMapper<ProcessSchema, ProcessEntity> {
  constructor(private readonly stepMapper: StepMapper) {}

  convertEntityToSchema(entity: ProcessEntity): ProcessSchema {
    const schema = new ProcessSchema();

    schema._id = new Types.ObjectId(entity?.id);
    schema.created_at = entity?.createdAt;
    schema.updated_at = entity?.updatedAt;
    schema.deleted_at = entity?.deletedAt;
    schema.owner = new Types.ObjectId(entity?.owner);
    schema.name = entity?.name;
    schema.roles = entity?.roles;
    schema.default_fail_step = entity?.defaultFailStep;
    schema.allowed_direct_debit = entity?.allowedDirectDebit;
    schema.max_amount = entity?.maxAmount;
    schema.period = entity?.period;
    schema.cron = entity?.cron;
    schema.validation_data = entity?.validation_data;
    schema.steps = entity?.steps?.map((step) =>
      this.stepMapper.convertEntityToSchema(step),
    );

    return schema;
  }

  convertSchemaToEntity(schema: ProcessSchema): ProcessEntity {
    return new ProcessEntity({
      id: schema?._id?.toString(),
      createdAt: schema?.created_at,
      updatedAt: schema?.updated_at,
      deletedAt: schema?.deleted_at,
      owner: schema?.owner?.toString(),
      name: schema?.name,
      roles: schema?.roles,
      defaultFailStep: schema?.default_fail_step,
      allowedDirectDebit: schema?.allowed_direct_debit,
      maxAmount: schema?.max_amount,
      period: schema?.period,
      cron: schema?.cron,
      validation_data: schema?.validation_data,
      steps: schema?.steps?.map((step) =>
        this.stepMapper.convertSchemaToEntity(step),
      ),
    });
  }

  convertRequestToEntity(
    request: Partial<CreateProcessRequest>,
    owner?: string,
  ): ProcessEntity {
    return new ProcessEntity({
      owner,
      name: request?.name,
      roles: request?.roles,
      defaultFailStep: request?.default_fail_step,
      allowedDirectDebit: request?.allowed_direct_debit,
      maxAmount: request?.max_amount,
      period: convertToPeriod(request?.period),
      cron: request?.cron,
      validation_data: request?.validation_data
        ? JSON.parse(request?.validation_data)
        : undefined,
      steps: request?.steps?.map((step) =>
        this.stepMapper.convertRequestToEntity(step),
      ),
    });
  }
}
