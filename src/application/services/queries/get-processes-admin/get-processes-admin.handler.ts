import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProcessesAdminCommand } from './get-processes-admin.command';
import { findAndCountAll } from 'infrastructure/database';
import { ProcessEntity } from 'domain/models';
import { ProcessRepository } from 'domain/services';

@QueryHandler(GetProcessesAdminCommand)
export class GetProcessesAdminHandler
  implements IQueryHandler<GetProcessesAdminCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute({
    request,
  }: GetProcessesAdminCommand): Promise<findAndCountAll<ProcessEntity>> {
    return this.processRepository.findAllAdmin(request);
  }
}
