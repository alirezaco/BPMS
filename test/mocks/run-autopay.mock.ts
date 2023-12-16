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
  data: { amount: 5200, defaultTrueBool: true, defaultFalseBool: false },
  max_amount: 5000000,
  is_active: true,
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
};
