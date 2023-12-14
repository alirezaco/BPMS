import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFileQuery } from './get-file.query';
import { FileRepository } from 'domain/services';
import { FileEntity } from 'domain/models';
import { MessageEnum } from 'infrastructure/enum';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetFileQuery)
export class GetFileHandler implements IQueryHandler<GetFileQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: GetFileQuery): Promise<FileEntity> {
    const { id } = query;
    const file = await this.fileRepository.findOneById(id);

    if (!file) {
      throw new NotFoundException(MessageEnum.FILE_NOT_FOUND);
    }

    return file;
  }
}
