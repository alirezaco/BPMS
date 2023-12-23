import { AutoPayActivityEntity, AutoPayActivitySchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoPayActivityMapper
  implements BaseMapper<AutoPayActivitySchema, AutoPayActivityEntity>
{
  convertEntityToSchema(entity: AutoPayActivityEntity): AutoPayActivitySchema {
    const schema = new AutoPayActivitySchema();

    schema._id = new Types.ObjectId(entity?.id);
    schema.created_at = entity?.createdAt;
    schema.updated_at = entity?.updatedAt;
    schema.deleted_at = entity?.deletedAt;
    schema.restored_at = entity?.restoreAt;
    schema.owner = new Types.ObjectId(entity?.owner);
    schema.tags = entity?.tags;
    schema.autopay_id = new Types.ObjectId(entity.autopayId);
    schema.process_id = new Types.ObjectId(entity.processId);
    schema.status = entity.status;
    schema.running_time = entity.runningTime;
    schema.successful_steps = entity.successfulSteps || [];
    schema.failed_steps = entity.failedSteps || [];
    schema.has_payment = entity.hasPayment || false;
    schema.payment_amount = entity.paymentAmount || 0;
    schema.RunningStep = entity.RunningStep;
    schema.responsesSteps = entity.responsesSteps || [];

    return schema;
  }

  convertSchemaToEntity(schema: AutoPayActivitySchema): AutoPayActivityEntity {
    if (!schema) return;

    return new AutoPayActivityEntity({
      id: schema?._id?.toString(),
      createdAt: schema?.created_at,
      updatedAt: schema?.updated_at,
      deletedAt: schema?.deleted_at,
      restoreAt: schema?.restored_at,
      owner: schema?.owner?.toString(),
      tags: schema?.tags,
      autopayId: schema?.autopay_id?.toString(),
      processId: schema?.process_id?.toString(),
      status: schema?.status,
      runningTime: schema?.running_time,
      successfulSteps: schema?.successful_steps,
      failedSteps: schema?.failed_steps,
      hasPayment: schema?.has_payment,
      paymentAmount: schema?.payment_amount,
      RunningStep: schema?.RunningStep,
      responsesSteps: schema?.responsesSteps,
      autopay: schema?.autopay && {
        id: schema?.autopay?._id?.toString(),
        name: schema?.autopay?.name,
        userId: schema?.autopay?.user_id?.toString(),
      },
      process: schema?.process && {
        id: schema?.process?._id?.toString(),
        name: schema?.process?.name,
      },
    });
  }
}
