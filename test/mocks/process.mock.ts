import { ProcessStepTypeEnum, SourceEnum } from 'infrastructure/enum';
import { CreateProcessRequest } from 'infrastructure/interfaces';
import { Types } from 'mongoose';

export const createProcessRequestMock: CreateProcessRequest = {
  name: 'test',
  roles: [],
  allowed_direct_debit: true,
  data: JSON.stringify({
    amount: 1000,
  }),
  steps: [
    {
      name: 'Y-Solowarm',
      type: ProcessStepTypeEnum.COMPARISON,
      is_payment: true,
      payment_param: {
        source: SourceEnum.PROCESS,
        key: 'amount',
        source_key: 'amount',
      },
      comparison: {
        func: 'eq' as any,
        left: {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
        right: {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
        children: [],
      },
    },
    {
      name: 'Y-Solowarmmmmm',
      type: ProcessStepTypeEnum.API,
      is_payment: false,
      is_final: true,
      api: {
        bodies: [],
        headers: [],
        params: [],
        queries: [],
        url: 'http://test.com',
        method: 'post',
      },
    },
    {
      name: 'Y-Solowarmmmm',
      type: ProcessStepTypeEnum.GRPC,
      is_payment: false,
      grpc: {
        metadata: [],
        package: 'test',
        service: 'test',
        url: 'http://test.com',
        method: 'test',
        payload: [],
        protofile: new Types.ObjectId().toString(),
      },
    },
  ],
  ui_schema: [
    {
      key: 'name',
      title: 'name',
      type: 'String',
    },
  ],
  period: 'day',
  max_amount: 1000,
  default_fail_step: "Y-Solowarmmmmm"
};
