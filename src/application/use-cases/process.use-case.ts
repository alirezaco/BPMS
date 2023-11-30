import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProcessCommand } from 'application/services';
import { ProcessEntity } from 'domain/models';
import { ProcessMapper } from 'domain/services';
import { CreateProcessRequest } from 'infrastructure/interfaces';

export class ProcessUseCase {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly processMapper: ProcessMapper,
  ) {}

  async create(request: CreateProcessRequest, me: string) {
    return this.commandBus.execute<CreateProcessCommand, ProcessEntity>(
      new CreateProcessCommand(
        this.processMapper.convertRequestToEntity(request, me),
      ),
    );
  }
}
