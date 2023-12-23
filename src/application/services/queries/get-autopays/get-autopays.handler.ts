import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAutopaysQuery } from './get-autopays.query';
import { AutoPayRepository, ProcessRepository } from 'domain/services';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { findAndCountAll } from 'infrastructure/database';
import {
  FindAutopayInterface,
  ListAutopayRequest,
} from 'infrastructure/interfaces';
import { NotFoundException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';

@QueryHandler(GetAutopaysQuery)
export class GetAutopaysHandler implements IQueryHandler<GetAutopaysQuery> {
  constructor(
    private readonly autopayRepository: AutoPayRepository,
    private readonly processRepository: ProcessRepository,
  ) {}

  async findByProcess(
    request: ListAutopayRequest,
    process: ProcessEntity,
    userId: string,
  ): Promise<FindAutopayInterface<AutoPayEntity>> {
    const autopays = await this.autopayRepository.findByUserId(request, userId);

    return {
      id: process.id,
      name: process.name,
      count: autopays.count,
      values: autopays.rows.map((x) => {
        x.setUISchema(process.UISchema);
        return x;
      }),
    };
  }

  async findByProcessId(
    request: ListAutopayRequest,
    userId: string,
  ): Promise<FindAutopayInterface<AutoPayEntity>> {
    const process = await this.processRepository.findOneById(
      request.process_id,
    );

    if (!process) {
      throw new NotFoundException(MessageEnum.PROCESS_NOT_FOUND);
    }

    return this.findByProcess(request, process, userId);
  }

  async findAll(
    request: ListAutopayRequest,
    userId: string,
  ): Promise<findAndCountAll<FindAutopayInterface<AutoPayEntity>>> {
    const process = await this.processRepository.findAll({
      include: { _id: 1, name: 1 },
    });

    return {
      count: process.count,
      rows: await Promise.all(
        process.rows.map(async (x) =>
          this.findByProcess({ ...request, process_id: x.id }, x, userId),
        ),
      ),
    };
  }

  async execute(
    query: GetAutopaysQuery,
  ): Promise<findAndCountAll<FindAutopayInterface<AutoPayEntity>>> {
    const { userId, request } = query;

    if (request.process_id) {
      const res = await this.findByProcessId(request, userId);
      return {
        count: 1,
        rows: [res],
      };
    }

    return this.findAll(request, userId);
  }
}
