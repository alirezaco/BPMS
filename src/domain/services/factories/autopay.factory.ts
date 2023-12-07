import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactory } from './base.factory';
import { AutoPayEntity, AutoPaySchema } from 'domain/models';
import { AutoPayMapper } from '../mappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoPayFactory extends BaseFactory<AutoPaySchema, AutoPayEntity> {
  constructor(
    protected readonly autopayMapper: AutoPayMapper,
    @InjectModel(AutoPaySchema.name)
    protected readonly autopayModel: Model<AutoPaySchema>,
  ) {
    super(autopayMapper, autopayModel);
  }
}
