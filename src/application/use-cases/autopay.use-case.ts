import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAutopayCommand } from 'application/services';
import { AutoPayEntity } from 'domain/models';
import { AutoPayMapper } from 'domain/services';
import { findAndCountAll } from 'infrastructure/database';
import { CreateAutopayRequest } from 'infrastructure/interfaces';

export class AutopayUseCase {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly autoPayMapper: AutoPayMapper,
  ) {}

  async createAutopay(
    createAutopayRequest: CreateAutopayRequest,
    me: string,
  ): Promise<AutoPayEntity> {
    return this.commandBus.execute<CreateAutopayCommand, AutoPayEntity>(
      new CreateAutopayCommand(
        this.autoPayMapper.convertRequestToEntity(createAutopayRequest, me),
      ),
    );
  }

  async updateAutopay(autopayEntity: AutoPayEntity): Promise<AutoPayEntity> {
    return;
  }

  async deleteAutopay(id: string): Promise<AutoPayEntity> {
    return;
  }

  async getAutopay(id: string): Promise<AutoPayEntity> {
    return;
  }

  async getAllAutopays(): Promise<findAndCountAll<AutoPayEntity>> {
    return;
  }
}
