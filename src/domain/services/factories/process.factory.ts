import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactory } from './base.factory';
import { ProcessMapper } from '../mappers/';
import { ProcessEntity, ProcessSchema } from 'domain/models';

@Injectable()
export class ProcessFactory extends BaseFactory<ProcessSchema, ProcessEntity> {
  constructor(
    protected readonly processMapper: ProcessMapper,
    @InjectModel(ProcessSchema.name)
    protected readonly processModel: Model<ProcessSchema>,
  ) {
    super(processMapper, processModel);
  }
}
