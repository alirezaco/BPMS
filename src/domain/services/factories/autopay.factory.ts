import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactory } from './base.factory';
import { AutoPayEntity, AutoPaySchema } from 'domain/models';
import { AutoPayMapper } from '../mappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoPayFactory extends BaseFactory<AutoPaySchema, AutoPayEntity> {
  constructor(
    protected readonly mapper: AutoPayMapper,
    @InjectModel(AutoPaySchema.name)
    protected readonly model: Model<AutoPaySchema>,
  ) {
    super(mapper, model);
  }
}
