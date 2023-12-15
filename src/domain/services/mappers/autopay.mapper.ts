import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base.mapper';
import { AutoPayEntity, AutoPaySchema } from 'domain/models';
import { Types } from 'mongoose';
import { CreateAutopayRequest } from 'infrastructure/interfaces';
import { convertToPeriod } from 'infrastructure/utils';

@Injectable()
export class AutoPayMapper implements BaseMapper<AutoPaySchema, AutoPayEntity> {
  convertEntityToSchema(entity: AutoPayEntity): AutoPaySchema {
    const schema = new AutoPaySchema();

    schema._id = new Types.ObjectId(entity?.id);
    schema.created_at = entity?.createdAt;
    schema.updated_at = entity?.updatedAt;
    schema.deleted_at = entity?.deletedAt;
    schema.restored_at = entity?.restoreAt;
    schema.owner = new Types.ObjectId(entity?.owner);
    schema.name = entity?.name;
    schema.user_id = new Types.ObjectId(entity?.userId);
    schema.process_id = new Types.ObjectId(entity?.processId);
    schema.max_amount = entity?.maxAmount;
    schema.allowed_direct_debit = entity?.allowedDirectDebit;
    schema.period = entity?.period;
    schema.cron = entity?.cron;
    schema.is_active = entity?.isActive;
    schema.last_run_at = entity?.lastRunAt;
    schema.processing_status = entity?.processingStatus;
    schema.data = entity?.data;

    return schema;
  }

  convertSchemaToEntity(schema: AutoPaySchema): AutoPayEntity {
    if (!schema) return;

    return new AutoPayEntity({
      id: schema?._id?.toString(),
      createdAt: schema?.created_at,
      updatedAt: schema?.updated_at,
      deletedAt: schema?.deleted_at,
      restoreAt: schema?.restored_at,
      owner: schema?.owner?.toString(),
      name: schema?.name,
      userId: schema?.user_id?.toString(),
      processId: schema?.process_id?.toString(),
      maxAmount: schema?.max_amount,
      allowedDirectDebit: schema?.allowed_direct_debit,
      period: schema?.period,
      cron: schema?.cron,
      isActive: schema?.is_active,
      lastRunAt: schema?.last_run_at,
      processingStatus: schema?.processing_status,
      data: schema?.data,
    });
  }

  convertRequestToEntity(
    request: Partial<CreateAutopayRequest>,
    me?: string,
  ): AutoPayEntity {
    return new AutoPayEntity({
      owner: me,
      name: request?.name,
      userId: me,
      processId: request?.process_id,
      maxAmount: request?.max_amount && +request?.max_amount.toString(),
      allowedDirectDebit: request?.allowed_direct_debit,
      period: request?.period && convertToPeriod(request?.period),
      cron: request?.cron,
      data: JSON.parse(request?.data || '{}'),
    });
  }
}
