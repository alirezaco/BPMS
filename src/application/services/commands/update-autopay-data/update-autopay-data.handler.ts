import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutoPayDataCommand } from './update-autopay-data.command';
import { AutoPayRepository, ProcessRepository } from 'domain/services';
import { AutoPayEntity } from 'domain/models';

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
    // TODO
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
