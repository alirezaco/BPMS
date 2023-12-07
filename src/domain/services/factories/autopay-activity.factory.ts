import { AutoPayActivityEntity, AutoPayActivitySchema } from 'domain/models';
import { BaseFactory } from './base.factory';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AutoPayActivityMapper } from '../mappers';

@Injectable()
export class AutoPayActivityFactory extends BaseFactory<
  AutoPayActivitySchema,
  AutoPayActivityEntity
> {
  constructor(
    @InjectModel(AutoPayActivitySchema.name)
    private readonly autopayActivityModel: Model<AutoPayActivitySchema>,
    private readonly autopayActivityMapper: AutoPayActivityMapper,
  ) {
    super(autopayActivityMapper, autopayActivityModel);
  }
}
