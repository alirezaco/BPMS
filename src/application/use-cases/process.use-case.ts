import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateFileCommand,
  CreateProcessCommand,
  DeleteProcessCommand,
  GetProcessQuery,
  GetProcessesAdminQuery,
  GetProcessesCommand,
  UpdateProcessAllowedDirectDebitCommand,
  UpdateProcessIsActiveCommand,
  UpdateProcessMaxAmountCommand,
  UpdateProcessNameCommand,
  UpdateProcessPeriodCommand,
  UpdateProcessRolesCommand,
  UpdateProcessStepsCommand,
} from 'application/services';
import { FileEntity, ProcessEntity } from 'domain/models';
import { FileMapper, ProcessMapper, StepMapper } from 'domain/services';
import { UISchemaMapper } from 'domain/services/mappers/ui-schema.mapper';
import { findAndCountAll } from 'infrastructure/database';
import {
  CreateFileRequest,
  CreateProcessRequest,
  ListProcessesAdminRequest,
  ListProcessesRequest,
  UpdateProcessRequest,
} from 'infrastructure/interfaces';
import { convertToPeriod } from 'infrastructure/utils';

@Injectable()
export class ProcessUseCase {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly processMapper: ProcessMapper,
    private readonly stepMapper: StepMapper,
    private readonly UISchemaMapper: UISchemaMapper,
    private readonly fileMapper: FileMapper,
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

    if (request.allowed_direct_debit !== undefined) {
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

    if (request.is_active !== undefined) {
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

    if (request.data || request.ui_schema || request.steps) {
      let steps = process.steps;
      let validationData = process.validationData;
      let data = process.data;
      let UISchema = process.UISchema;

      if (request.steps) {
        steps = request.steps.map((x) =>
          this.stepMapper.convertRequestToEntity(x),
        );
      }

      if (request.ui_schema) {
        UISchema = request.ui_schema.map((x) =>
          this.UISchemaMapper.convertRequestToEntity(x),
        );
        validationData = this.processMapper.createValidationDataFromUISchema(
          request.ui_schema,
        );
      }

      if (request.data) {
        data = JSON.parse(request.data);
      }

      process = await this.commandBus.execute<
        UpdateProcessStepsCommand,
        ProcessEntity
      >(
        new UpdateProcessStepsCommand(
          process,
          steps,
          validationData,
          data,
          UISchema,
          request.default_fail_step || process.defaultFailStep,
        ),
      );
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
      GetProcessesAdminQuery,
      findAndCountAll<ProcessEntity>
    >(new GetProcessesAdminQuery(request));
  }

  async createFile(
    request: CreateFileRequest,
    me: string,
  ): Promise<FileEntity> {
    return this.commandBus.execute<CreateFileCommand, FileEntity>(
      new CreateFileCommand(
        this.fileMapper.convertRequestToEntity(request, me),
      ),
    );
  }
}
