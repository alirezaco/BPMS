import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AutoPaySerializer } from 'application/serializers';
import {
  CreateAutopayCommand,
  DeleteAutopayCommand,
  GetAutopayQuery,
  GetAutopaysAdminQuery,
  GetAutopaysQuery,
  UpdateAutoPayDataCommand,
  UpdateAutoPayNameCommand,
  UpdateAutopayDirectDebitCommand,
  UpdateAutopayIsActiveCommand,
  UpdateAutopayMaxAmountCommand,
  UpdateAutopayMetadataCommand,
  UpdateAutopayMinAmountCommand,
  UpdateAutopayPeriodCommand,
} from 'application/services';
import { AutoPayEntity } from 'domain/models';
import { AutoPayMapper } from 'domain/services';
import { UserProxy } from 'domain/services/proxies';
import { findAndCountAll } from 'infrastructure/database';
import { MessageEnum } from 'infrastructure/enum';
import {
  CreateAutopayRequest,
  FindAutopayInterface,
  ListAutopayAdminRequest,
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
    private readonly userProxy: UserProxy,
  ) {}

  async createAutopay(
    createAutopayRequest: CreateAutopayRequest,
    me: string,
  ): Promise<AutoPaySerializer> {
    const res = await this.commandBus.execute<
      CreateAutopayCommand,
      AutoPayEntity
    >(
      new CreateAutopayCommand(
        this.autoPayMapper.convertRequestToEntity(createAutopayRequest, me),
      ),
    );

    return new AutoPaySerializer(res);
  }

  async updateAutopay(
    updateAutopayRequest: UpdateAutopayRequest,
    me: string,
  ): Promise<AutoPaySerializer> {
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

    if (updateAutopayRequest.allowed_direct_debit !== undefined) {
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

    if (updateAutopayRequest.metadata) {
      autopay = await this.commandBus.execute<
        UpdateAutopayMetadataCommand,
        AutoPayEntity
      >(
        new UpdateAutopayMetadataCommand(
          autopay,
          JSON.parse(updateAutopayRequest.metadata),
        ),
      );
    }

    if (updateAutopayRequest.min_amount) {
      autopay = await this.commandBus.execute<
        UpdateAutopayMinAmountCommand,
        AutoPayEntity
      >(
        new UpdateAutopayMinAmountCommand(
          autopay,
          updateAutopayRequest.min_amount,
        ),
      );
    }

    return new AutoPaySerializer(autopay);
  }

  async deleteAutopay(id: string, me: string): Promise<AutoPaySerializer> {
    let autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(id),
    );

    if (autopay.userId !== me) {
      throw new ForbiddenException(MessageEnum.FORBIDDEN);
    }

    const res = await this.commandBus.execute<
      DeleteAutopayCommand,
      AutoPayEntity
    >(new DeleteAutopayCommand(id));

    return new AutoPaySerializer(res);
  }

  async getAutopay(id: string, me: string): Promise<AutoPaySerializer> {
    const autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(id),
    );

    if (autopay.userId !== me) {
      throw new ForbiddenException(MessageEnum.FORBIDDEN);
    }

    const user = await this.userProxy.findMe(autopay.userId);

    autopay.setUser({
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      id: user.id,
    });

    return new AutoPaySerializer(autopay);
  }

  async getAllAutopays(
    request: ListAutopayRequest,
    me: string,
  ): Promise<findAndCountAll<FindAutopayInterface<AutoPaySerializer>>> {
    const res = await this.queryBus.execute<
      GetAutopaysQuery,
      findAndCountAll<FindAutopayInterface<AutoPayEntity>>
    >(new GetAutopaysQuery(request, me));

    return {
      count: res.count,
      rows: res.rows.map((x) => ({
        count: x.count,
        id: x.id,
        name: x.name,
        service_name: x.service_name,
        values: x.values.map((y) => new AutoPaySerializer(y)),
      })),
    };
  }

  async getAllAutopaysAdmin(
    request: ListAutopayAdminRequest,
  ): Promise<findAndCountAll<AutoPaySerializer>> {
    const res = await this.queryBus.execute<
      GetAutopaysAdminQuery,
      findAndCountAll<AutoPayEntity>
    >(new GetAutopaysAdminQuery(request));

    return {
      count: res.count,
      rows: await Promise.all(
        res.rows.map(async (x) => {
          const user = await this.userProxy.findMe(x.userId);
          x.setUser({
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            id: user.id,
          });
          return new AutoPaySerializer(x);
        }),
      ),
    };
  }
}
