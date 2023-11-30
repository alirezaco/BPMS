import { BadRequestException } from '@nestjs/common';
import { MessageEnum, ProcessStepTypeEnum } from 'infrastructure/enum';

export const convertToStepType = (type: string): ProcessStepTypeEnum => {
  switch (type) {
    case ProcessStepTypeEnum.API:
      return ProcessStepTypeEnum.API;
    case ProcessStepTypeEnum.GRPC:
      return ProcessStepTypeEnum.GRPC;
    case ProcessStepTypeEnum.COMPARISON:
      return ProcessStepTypeEnum.COMPARISON;
    default:
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);
  }
};
