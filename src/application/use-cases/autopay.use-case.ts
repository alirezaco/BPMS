import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateAutopayCommand,
  DeleteAutopayCommand,
  GetAutopayQuery,
  GetAutopaysQuery,
  GetProcessQuery,
  UpdateAutoPayDataCommand,
  UpdateAutopayDirectDebitCommand,
  UpdateAutopayIsActiveCommand,
  UpdateAutopayMaxAmountCommand,
  UpdateAutopayPeriodCommand,
} from 'application/services';
import { UpdateAutoPayNameCommand } from 'application/services/commands/update-autopay-name';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { AutoPayMapper } from 'domain/services';
import { findAndCountAll } from 'infrastructure/database';
import { MessageEnum } from 'infrastructure/enum';
import {
  CreateAutopayRequest,
  FindAutopayInterface,
  ListAutopayRequest,
  UpdateAutopayRequest,
} from 'infrastructure/interfaces';
import { convertToPeriod } from 'infrastructure/utils';

@Injectable()
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

  async updateAutopay(
    updateAutopayRequest: UpdateAutopayRequest,
    me: string,
  ): Promise<AutoPayEntity> {
    let autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(updateAutopayRequest.id),
    );

    if (autopay.userId !== me) {
      throw new ForbiddenException(MessageEnum.FORBIDDEN);
    }

    if (updateAutopayRequest.name) {
      autopay = await this.commandBus.execute<
        UpdateAutoPayNameCommand,
        AutoPayEntity
      >(new UpdateAutoPayNameCommand(autopay, updateAutopayRequest.name));
    }

    if (updateAutopayRequest.allowed_direct_debit) {
      autopay = await this.commandBus.execute<
        UpdateAutopayDirectDebitCommand,
        AutoPayEntity
      >(
        new UpdateAutopayDirectDebitCommand(
          autopay,
          updateAutopayRequest.allowed_direct_debit,
        ),
      );
    }

    if (updateAutopayRequest.period || updateAutopayRequest.cron) {
      const period = updateAutopayRequest.period
        ? convertToPeriod(updateAutopayRequest.period)
        : autopay.period;

      const cron = updateAutopayRequest.cron || autopay.cron;

      autopay = await this.commandBus.execute<
        UpdateAutopayPeriodCommand,
        AutoPayEntity
      >(new UpdateAutopayPeriodCommand(autopay, period, cron));
    }

    if (updateAutopayRequest.data) {
      autopay = await this.commandBus.execute<
        UpdateAutoPayDataCommand,
        AutoPayEntity
      >(
        new UpdateAutoPayDataCommand(
          autopay,
          JSON.parse(updateAutopayRequest.data),
        ),
      );
    }

    if (updateAutopayRequest.is_active !== undefined) {
      autopay = await this.commandBus.execute<
        UpdateAutopayIsActiveCommand,
        AutoPayEntity
      >(
        new UpdateAutopayIsActiveCommand(
          autopay,
          updateAutopayRequest.is_active,
        ),
      );
    }

    if (updateAutopayRequest.max_amount) {
      autopay = await this.commandBus.execute<
        UpdateAutopayMaxAmountCommand,
        AutoPayEntity
      >(
        new UpdateAutopayMaxAmountCommand(
          autopay,
          updateAutopayRequest.max_amount,
        ),
      );
    }

    return autopay;
  }

  async deleteAutopay(id: string, me: string): Promise<AutoPayEntity> {
    let autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(id),
    );

    if (autopay.userId !== me) {
      throw new ForbiddenException(MessageEnum.FORBIDDEN);
    }

    return this.commandBus.execute<DeleteAutopayCommand, AutoPayEntity>(
      new DeleteAutopayCommand(id),
    );
  }

  async getAutopay(id: string, me: string): Promise<AutoPayEntity> {
    const autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(id),
    );

    if (autopay.userId !== me) {
      throw new ForbiddenException(MessageEnum.FORBIDDEN);
    }

    const process = await this.queryBus.execute<GetProcessQuery, ProcessEntity>(
      new GetProcessQuery(autopay.processId),
    );

    autopay.setUISchema(process.UISchema);

    return autopay;
  }

  async getAllAutopays(
    request: ListAutopayRequest,
    me: string,
  ): Promise<findAndCountAll<FindAutopayInterface<AutoPayEntity>>> {
    return this.queryBus.execute<
      GetAutopaysQuery,
      findAndCountAll<FindAutopayInterface<AutoPayEntity>>
    >(new GetAutopaysQuery(request, me));
  }
}
