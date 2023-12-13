import { FileEntity, FileSchema } from 'domain/models';
import { BaseFactory } from './base.factory';
import { FileMapper } from '../mappers';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileFactory extends BaseFactory<FileSchema, FileEntity> {
  constructor(
    protected readonly fileMapper: FileMapper,
    protected readonly fileModel: Model<FileSchema>,
  ) {
    super(fileMapper, fileModel);
  }
}
