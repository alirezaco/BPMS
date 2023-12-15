import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAutopaysAdminQuery } from './get-autopays-admin.query';
import { findAndCountAll } from 'infrastructure/database';
import { AutoPayEntity } from 'domain/models';
import { AutoPayRepository } from 'domain/services';

@QueryHandler(GetAutopaysAdminQuery)
export class GetAutopaysAdminHandler
  implements IQueryHandler<GetAutopaysAdminQuery>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute({
    request,
  }: GetAutopaysAdminQuery): Promise<findAndCountAll<AutoPayEntity>> {
    return this.autopayRepository.findAllAdmin(request);
  }
}
