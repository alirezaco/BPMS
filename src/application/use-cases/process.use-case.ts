import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProcessCommand,
  DeleteProcessCommand,
  GetProcessQuery,
  GetProcessesAdminCommand,
  GetProcessesCommand,
  UpdateProcessAllowedDirectDebitCommand,
  UpdateProcessIsActiveCommand,
  UpdateProcessMaxAmountCommand,
  UpdateProcessNameCommand,
  UpdateProcessPeriodCommand,
  UpdateProcessRolesCommand,
  UpdateProcessStepsCommand,
} from 'application/services';
import { ProcessEntity } from 'domain/models';
import { ProcessMapper, StepMapper } from 'domain/services';
import { findAndCountAll } from 'infrastructure/database';
import {
  CreateProcessRequest,
  ListProcessesAdminRequest,
  ListProcessesRequest,
  UpdateProcessRequest,
} from 'infrastructure/interfaces';
import { convertToPeriod } from 'infrastructure/utils';

export class ProcessUseCase {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly processMapper: ProcessMapper,
    private readonly stepMapper: StepMapper,
  ) {}

  async create(
    request: CreateProcessRequest,
    me: string,
  ): Promise<ProcessEntity> {
    return this.commandBus.execute<CreateProcessCommand, ProcessEntity>(
      new CreateProcessCommand(
        this.processMapper.convertRequestToEntity(request, me),
      ),
    );
  }

  async update(
    request: UpdateProcessRequest,
    _: string, //user id
  ): Promise<ProcessEntity> {
    let process = await this.queryBus.execute<GetProcessQuery, ProcessEntity>(
      new GetProcessQuery(request.id),
    );

    if (request.allowed_direct_debit) {
      process = await this.commandBus.execute<
        UpdateProcessAllowedDirectDebitCommand,
        ProcessEntity
      >(
        new UpdateProcessAllowedDirectDebitCommand(
          process,
          request.allowed_direct_debit,
        ),
      );
    }

    if (request.name) {
      process = await this.commandBus.execute<
        UpdateProcessNameCommand,
        ProcessEntity
      >(new UpdateProcessNameCommand(process, request.name));
    }

    if (request.max_amount) {
      process = await this.commandBus.execute<
        UpdateProcessMaxAmountCommand,
        ProcessEntity
      >(new UpdateProcessMaxAmountCommand(process, request.max_amount));
    }

    if (request.is_active) {
      process = await this.commandBus.execute<
        UpdateProcessIsActiveCommand,
        ProcessEntity
      >(new UpdateProcessIsActiveCommand(process, request.is_active));
    }

    if (request.period || request.cron) {
      process = await this.commandBus.execute<
        UpdateProcessPeriodCommand,
        ProcessEntity
      >(
        new UpdateProcessPeriodCommand(
          process,
          convertToPeriod(request.period || process.period),
          request.cron || process.cron,
        ),
      );
    }

    if (request.roles) {
      process = await this.commandBus.execute<
        UpdateProcessRolesCommand,
        ProcessEntity
      >(new UpdateProcessRolesCommand(process, request.roles));
    }

    if (request.data || request.validation_data || request.steps) {
      let steps = process.steps;
      let validationData = process.validationData;
      let data = process.data;

      if (request.steps) {
        steps = request.steps.map((x) =>
          this.stepMapper.convertRequestToEntity(x),
        );
      }

      if (request.validation_data) {
        validationData = JSON.parse(request.validation_data);
      }

      if (request.data) {
        data = JSON.parse(request.data);
      }

      process = await this.commandBus.execute<
        UpdateProcessStepsCommand,
        ProcessEntity
      >(new UpdateProcessStepsCommand(process, steps, validationData, data));
    }

    return process;
  }

  async delete(id: string): Promise<ProcessEntity> {
    return this.commandBus.execute<DeleteProcessCommand, ProcessEntity>(
      new DeleteProcessCommand(id),
    );
  }

  async getProcess(id: string): Promise<ProcessEntity> {
    return this.queryBus.execute<GetProcessQuery, ProcessEntity>(
      new GetProcessQuery(id),
    );
  }

  async getProcesses(
    request: ListProcessesRequest,
    roles: string[],
  ): Promise<findAndCountAll<ProcessEntity>> {
    return this.queryBus.execute<
      GetProcessesCommand,
      findAndCountAll<ProcessEntity>
    >(new GetProcessesCommand(request, roles));
  }

  async getProcessesAdmin(
    request: ListProcessesAdminRequest,
  ): Promise<findAndCountAll<ProcessEntity>> {
    return this.queryBus.execute<
      GetProcessesAdminCommand,
      findAndCountAll<ProcessEntity>
    >(new GetProcessesAdminCommand(request));
  }
}
