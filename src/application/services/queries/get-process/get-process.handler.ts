import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProcessQuery } from './get-process.query';
import { ProcessRepository } from 'domain/services';
import { NotFoundException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';

@QueryHandler(GetProcessQuery)
export class GetProcessHandler implements IQueryHandler<GetProcessQuery> {
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute({ id }: GetProcessQuery) {
    const process = await this.processRepository.findOneById(id);

    if (!process) {
      throw new NotFoundException(MessageEnum.PROCESS_NOT_FOUND);
    }

    return process;
  }
}
