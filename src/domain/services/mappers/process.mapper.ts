import { CreateProcessRequest, UISchema } from 'infrastructure/interfaces';
import { BaseMapper } from './base.mapper';
import { ProcessEntity, ProcessSchema } from 'domain/models';
import { StepMapper } from './step.mapper';
import { Types } from 'mongoose';
import { convertToPeriod, convertType } from 'infrastructure/utils';
import { UISchemaMapper } from './ui-schema.mapper';
import { Schema as joiSchema } from 'json-joi-converter';
import { Injectable } from '@nestjs/common';
import { RepeatMapper } from './repeat.mapper';

@Injectable()
export class ProcessMapper implements BaseMapper<ProcessSchema, ProcessEntity> {
  constructor(
    private readonly stepMapper: StepMapper,
    private readonly UISchemaMapper: UISchemaMapper,
    private readonly repeatMapper: RepeatMapper,
  ) {}

  convertEntityToSchema(entity: ProcessEntity): ProcessSchema {
    const schema = new ProcessSchema();

    schema._id = new Types.ObjectId(entity?.id);
    schema.created_at = entity?.createdAt;
    schema.updated_at = entity?.updatedAt;
    schema.deleted_at = entity?.deletedAt;
    schema.restored_at = entity?.restoreAt;
    schema.owner = new Types.ObjectId(entity?.owner);
    schema.name = entity?.name;
    schema.roles = entity?.roles;
    schema.default_fail_step = entity?.defaultFailStep;
    schema.allowed_direct_debit = entity?.allowedDirectDebit;
    schema.max_amount = entity?.maxAmount;
    schema.period = entity?.period;
    schema.cron = entity?.cron;
    schema.validation_data = entity?.validationData;
    schema.steps = entity?.steps?.map((step) =>
      this.stepMapper.convertEntityToSchema(step),
    );
    schema.data = entity?.data;
    schema.is_active = entity?.isActive;
    schema.ui_schema = entity?.UISchema?.map((uiSchema) =>
      this.UISchemaMapper.convertEntityToSchema(uiSchema),
    );
    schema.min_amount = entity?.minAmount;
    schema.service_name = entity?.serviceName;
    schema.is_repeatable = entity?.isRepeatable;
    schema.repeat =
      entity?.repeat && this.repeatMapper.convertEntityToSchema(entity?.repeat);

    return schema;
  }

  convertSchemaToEntity(schema: ProcessSchema): ProcessEntity {
    if (!schema) return;

    return new ProcessEntity({
      id: schema?._id?.toString(),
      createdAt: schema?.created_at,
      updatedAt: schema?.updated_at,
      deletedAt: schema?.deleted_at,
      restoreAt: schema?.restored_at,
      owner: schema?.owner?.toString(),
      name: schema?.name,
      roles: schema?.roles,
      defaultFailStep: schema?.default_fail_step,
      allowedDirectDebit: schema?.allowed_direct_debit,
      maxAmount: schema?.max_amount,
      period: schema?.period,
      cron: schema?.cron,
      validationData: schema?.validation_data,
      steps: schema?.steps?.map((step) =>
        this.stepMapper.convertSchemaToEntity(step),
      ),
      data: schema?.data,
      isActive: schema?.is_active,
      UISchema: schema?.ui_schema?.map((uiSchema) =>
        this.UISchemaMapper.convertSchemaToEntity(uiSchema),
      ),
      minAmount: schema?.min_amount,
      serviceName: schema?.service_name,
      isRepeatable: schema?.is_repeatable,
      repeat:
        schema?.repeat &&
        this.repeatMapper.convertSchemaToEntity(schema?.repeat),
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
      maxAmount: request?.max_amount && +request?.max_amount.toString(),
      period: request?.period && convertToPeriod(request?.period),
      cron: request?.cron,
      UISchema: request?.ui_schema?.map((uiSchema) =>
        this.UISchemaMapper.convertRequestToEntity(uiSchema),
      ),
      steps: request?.steps?.map((step) =>
        this.stepMapper.convertRequestToEntity(step),
      ),
      data: request?.data ? JSON.parse(request?.data) : undefined,
      validationData: this.createValidationDataFromUISchema(request?.ui_schema),
      minAmount: request?.min_amount && +request?.min_amount.toString(),
      serviceName: request?.service_name,
      isRepeatable: request?.is_repeatable,
      repeat:
        request?.repeat &&
        this.repeatMapper.convertRequestToEntity(request?.repeat),
    });
  }

  createValidationDataFromUISchema(uiSchema: UISchema[]): Record<string, any> {
    const validationData: joiSchema = {
      type: 'object',
      properties: {},
    };

    if (uiSchema) {
      uiSchema.forEach((uiSchema) => {
        validationData.properties[uiSchema?.key] = {
          type: convertType(uiSchema?.type),
          min: uiSchema?.min,
          max: uiSchema?.max,
          pattern: uiSchema?.regex && `/${uiSchema?.regex}/`,
          required: uiSchema?.is_required,
        };
      });
    }

    return validationData;
  }
}
