import { ProcessSchema, StepSchema } from 'domain/models';
import {
  ComparisonFunctionEnum,
  PeriodEnum,
  ProcessStepTypeEnum,
  ProcessingStatusEnum,
  SourceEnum,
} from 'infrastructure/enum';
import { Types } from 'mongoose';

export const baseProcessMock: Omit<ProcessSchema, 'steps'> = {
  _id: new Types.ObjectId('657ac17efc13ae364bfa20f1'),
  created_at: new Date('2022-12-10T09:54:19.000Z'),
  updated_at: new Date('2023-08-25T17:27:16.000Z'),
  owner: new Types.ObjectId('657ac17efc13ae364bfa20e2'),
  name: 'Tresom',
  roles: ['user'],
  allowed_direct_debit: false,
  period: PeriodEnum.DAY,
  validation_data: { type: 'object', properties: { name: { type: 'string' } } },
  ui_schema: [{ key: 'name', title: 'name', type: 'string' }],
  data: {
    amount: 5200,
    defaultTrueBool: true,
    defaultFalseBool: false,
    okStatus: 200,
  },
  max_amount: 5000000,
  is_active: true,
  service_name: 'test',
};

export const simpleSteps: StepSchema[] = [
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
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
];

export const comparisonStepsLevel1: StepSchema[] = [
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm1',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.AUTO_PAY,
        key: 'name',
        source_key: 'name',
      },
      children: [],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm2',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      right: {
        source: SourceEnum.AUTO_PAY,
        key: 'name',
        source_key: 'name',
      },
      children: [],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm3',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
];

export const comparisonStepsLevel2: StepSchema[] = [
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm1',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm2',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      right: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm3',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
];

export const comparisonStepsLevel3: StepSchema[] = [
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm1',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm2',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      right: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm3',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm4',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      right: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      left: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
];

export const comparisonStepsLevel4: StepSchema[] = [
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'Y-Solowarm1',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      right: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      left: {
        source: SourceEnum.PROCESS,
        key: 'defaultTrueBool',
        source_key: 'defaultTrueBool',
      },
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
];

export const autopayMock = {
  _id: new Types.ObjectId('657b139ffc13ae0569fa211d'),
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true,
  owner: new Types.ObjectId('657b139ffc13ae0569fa2121'),
  data: {
    name: 'test',
  },
  period: PeriodEnum.DAY,
  last_run_at: null,
  processing_status: ProcessingStatusEnum.PENDING,
  name: 'test',
  user_id: new Types.ObjectId('657b139ffc13ae0569fa2121'),
  process_id: new Types.ObjectId('657ac17efc13ae364bfa20f1'),
  max_amount: 10000,
  allowed_direct_debit: false,
  metadata: {},
};

export const grpcSteps: StepSchema[] = [
  {
    _id: new Types.ObjectId('657b139ffc13ae0569fa211d'),
    name: 'test',
    type: ProcessStepTypeEnum.GRPC,
    is_payment: false,
    grpc: {
      url: 'example.com:3113',
      method: 'TestMethod',
      package: 'Test',
      service: 'TestService',
      protofile: new Types.ObjectId('657b139ffc13ae0569ff211d'),
      metadata: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
      payload: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
    },
  },
  {
    _id: new Types.ObjectId('657b139ffc13ae0569fa211d'),
    name: 'check',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.BEFORE_STEP,
        key: 'test.meta.status',
        source_key: 'test.meta.status',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      children: [],
    },
  },
];

export const apiSteps: StepSchema[] = [
  {
    _id: new Types.ObjectId('657b139ffc13ae0569fa211d'),
    name: 'test',
    type: ProcessStepTypeEnum.API,
    is_payment: false,
    api: {
      url: 'http://test.com/:name',
      method: 'post',
      headers: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
      body: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
      params: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
      query: [
        {
          source: SourceEnum.AUTO_PAY,
          key: 'name',
          source_key: 'name',
        },
      ],
    },
  },
  {
    _id: new Types.ObjectId('657b139ffc13ae0569fa211d'),
    name: 'check',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.BEFORE_STEP,
        key: 'test.status',
        source_key: 'test.status',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      children: [],
    },
  },
];

export const complexSteps: StepSchema[] = [
  {
    _id: new Types.ObjectId(),
    name: 'step1',
    type: ProcessStepTypeEnum.API,
    is_payment: false,
    api: {
      url: 'http://test.com/',
      method: 'post',
      headers: [],
      body: [],
      params: [],
      query: [],
    },
  },
  {
    _id: new Types.ObjectId(),
    name: 'step2',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.BEFORE_STEP,
        key: 'step1.status',
        source_key: 'step1.status',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      children: [],
    },
  },
  {
    _id: new Types.ObjectId(),
    name: 'step3',
    type: ProcessStepTypeEnum.GRPC,
    is_payment: false,
    grpc: {
      url: 'test:3113',
      method: 'TestMethod',
      package: 'Test',
      service: 'TestService',
      protofile: new Types.ObjectId('657b139ffc13ae0569ff211d'),
      metadata: [],
      payload: [],
    },
  },
  {
    _id: new Types.ObjectId(),
    name: 'sync1',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'name',
        source_key: 'name',
      },
      children: [],
    },
    is_sync: true,
  },
  {
    _id: new Types.ObjectId(),
    name: 'step4',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.BEFORE_STEP,
        key: 'step3.meta.status',
        source_key: 'step3.meta.status',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      children: [],
    },
  },
  {
    _id: new Types.ObjectId(),
    name: 'step5',
    type: ProcessStepTypeEnum.API,
    is_payment: true,
    payment_param: {
      source: SourceEnum.PROCESS,
      key: 'amount',
      source_key: 'amount',
    },
    api: {
      url: 'http://test.com/',
      method: 'post',
      headers: [],
      body: [
        {
          source: SourceEnum.PROCESS,
          key: 'amount',
          source_key: 'amount',
        },
      ],
      params: [],
      query: [],
    },
  },
  {
    _id: new Types.ObjectId(),
    name: 'step6',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      left: {
        source: SourceEnum.BEFORE_STEP,
        key: 'step5.status',
        source_key: 'step5.status',
      },
      right: {
        source: SourceEnum.PROCESS,
        key: 'okStatus',
        source_key: 'okStatus',
      },
      children: [],
    },
    is_final: true,
  },
];

export const invalidAutopayWithRetry: StepSchema[] = [
  {
    _id: new Types.ObjectId(),
    name: 'step1',
    type: ProcessStepTypeEnum.API,
    is_payment: false,
    api: {
      url: 'http://test.com/',
      method: 'post',
      headers: [],
      body: [],
      params: [],
      query: [],
    },
  },
];

export const invalidAutopayWithoutRetry: StepSchema[] = [
  {
    _id: new Types.ObjectId(),
    name: 'step1',
    type: ProcessStepTypeEnum.API,
    is_payment: false,
    fail_step: 'failed',
    api: {
      url: 'http://test.com/',
      method: 'post',
      headers: [],
      body: [],
      params: [],
      query: [],
    },
  },
  {
    _id: new Types.ObjectId('657ac17efc13ae364bfa20e3'),
    name: 'failed',
    type: ProcessStepTypeEnum.COMPARISON,
    is_payment: false,
    is_final: true,
    comparison: {
      func: ComparisonFunctionEnum.Eq,
      children: [
        {
          func: ComparisonFunctionEnum.Eq,
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
      ],
    },
  },
];
