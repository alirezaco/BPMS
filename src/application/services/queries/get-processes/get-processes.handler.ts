import { ProcessRepository } from 'domain/services';
import { GetProcessesCommand } from './get-processes.command';
import { findAndCountAll } from 'infrastructure/database';
import { ProcessEntity } from 'domain/models';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetProcessesCommand)
export class GetProcessesHandler
  implements ICommandHandler<GetProcessesCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute({
    request,
    roles,
  }: GetProcessesCommand): Promise<findAndCountAll<ProcessEntity>> {
    const processes = await this.processRepository.findAll({
      limit: request.limit,
      skip: request.skip,
      where: {
        roles: { $in: roles },
      },
    });

    return processes;
  }
}
