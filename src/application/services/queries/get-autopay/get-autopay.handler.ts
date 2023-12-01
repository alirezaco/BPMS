import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAutopayQuery } from './get-autopay.query';
import { AutoPayEntity } from 'domain/models';
import { AutoPayRepository } from 'domain/services';
import { NotFoundException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';

@QueryHandler(GetAutopayQuery)
export class GetAutopayHandler
  implements IQueryHandler<GetAutopayQuery, AutoPayEntity>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(query: GetAutopayQuery): Promise<AutoPayEntity> {
    const { id } = query;

    // Retrieve the autopay entity from the repository
    const autopay = await this.autopayRepository.findOneById(id);

    if (!autopay) {
      // Throw an exception if the autopay entity is not found
      throw new NotFoundException(MessageEnum.AUTOPAY_NOT_FOUND);
    }

    return autopay;
  }
}
