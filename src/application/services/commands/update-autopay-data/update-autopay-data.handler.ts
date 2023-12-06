import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutoPayDataCommand } from './update-autopay-data.command';
import { AutoPayRepository, ProcessRepository } from 'domain/services';
import { AutoPayEntity } from 'domain/models';
import { fromJson } from 'json-joi-converter';
import { BadRequestException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';

@CommandHandler(UpdateAutoPayDataCommand)
export class UpdateAutoPayDataHandler
  implements ICommandHandler<UpdateAutoPayDataCommand>
{
  constructor(
    private readonly autopayRepository: AutoPayRepository,
    private readonly processRepository: ProcessRepository,
  ) {}

  async validatData(
    data: Record<string, any>,
    validationData: Record<string, any>,
  ) {
    try {
      const joiSchema = fromJson({
        type: 'object',
        properties: validationData,
      });

      await joiSchema.validateAsync(data);
    } catch (error) {
      throw new BadRequestException(MessageEnum.INVALID_DATA);
    }
  }

  async execute(command: UpdateAutoPayDataCommand): Promise<AutoPayEntity> {
    const { autopayEntity, data } = command;
    const process = await this.processRepository.findOneById(
      autopayEntity.processId,
    );

    // Validate the data
    this.validatData(data, process.data);

    // Update the autopay data
    autopayEntity.data = data;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
