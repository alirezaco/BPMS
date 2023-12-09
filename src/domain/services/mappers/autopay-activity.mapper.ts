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
    return new AutoPayActivityEntity({
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
    });
  }
}
