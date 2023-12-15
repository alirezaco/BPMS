import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProcessesAdminQuery } from './get-processes-admin.query';
import { findAndCountAll } from 'infrastructure/database';
import { ProcessEntity } from 'domain/models';
import { ProcessRepository } from 'domain/services';

@QueryHandler(GetProcessesAdminQuery)
export class GetProcessesAdminHandler
  implements IQueryHandler<GetProcessesAdminQuery>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute({
    request,
  }: GetProcessesAdminQuery): Promise<findAndCountAll<ProcessEntity>> {
    return this.processRepository.findAllAdmin(request);
  }
}
