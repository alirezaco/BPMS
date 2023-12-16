import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ProcessQueue } from 'application/services';
import { AutopayModule } from 'autopay.module';
import {
  AutoPayActivitySchema,
  AutoPaySchema,
  ProcessSchema,
  StepSchema,
} from 'domain/models';
import { Model } from 'mongoose';
import { dropDbUtil } from './utils';
import {
  autopayMock,
  baseProcessMock,
  comparisonStepsLevel1,
  comparisonStepsLevel2,
  comparisonStepsLevel3,
  comparisonStepsLevel4,
  simpleSteps,
} from './mocks';
import { ActivityStatusEnum, ProcessingStatusEnum } from 'infrastructure/enum';

describe('RunAutopay (e2e)', () => {
  let app: INestApplication;
  let processQueue: ProcessQueue;
  let processModel: Model<ProcessSchema>;
  let autopayModel: Model<AutoPaySchema>;
  let activityModel: Model<AutoPayActivitySchema>;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-run-test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AutopayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    processQueue = app.get<ProcessQueue>(ProcessQueue);
    processModel = app.get<Model<ProcessSchema>>(
      getModelToken(ProcessSchema.name),
    );
    autopayModel = app.get<Model<AutoPaySchema>>(
      getModelToken(AutoPaySchema.name),
    );
    activityModel = app.get<Model<AutoPayActivitySchema>>(
      getModelToken(AutoPayActivitySchema.name),
    );
  });

  afterAll(async () => {
    // await dropDbUtil(app);
  });

  beforeEach(async () => {
    await autopayModel.create(autopayMock);
  });

  afterEach(async () => {
    await processModel.deleteMany({ _id: baseProcessMock._id });
    await autopayModel.deleteMany({ _id: autopayMock._id });
    // await activityModel.deleteMany({ autopay_id: autopayMock._id });
  });

  const insertProcess = async (steps: StepSchema[]) => {
    await processModel.create({ ...baseProcessMock, steps });
  };

  const checkExistActivity = async (status: ActivityStatusEnum) => {
    const activity = await activityModel.findOne({
      autopay_id: autopayMock._id,
    });

    expect(activity).toBeDefined();
    expect(activity.status).toBe(status);
  };

  const initTests = async (steps: StepSchema[]) => {
    await insertProcess(steps);

    await processQueue.execute({
      data: { autopayId: autopayMock._id.toString() },
    } as any);

    const autopay = await autopayModel.findOne({ _id: autopayMock._id });

    expect(autopay).toBeDefined();
    expect(autopay.last_run_at).not.toBe(null);
    expect(autopay.processing_status).toBe(ProcessingStatusEnum.COMPLETED);

    await checkExistActivity(ActivityStatusEnum.SUCCESSFUL);
  };

  it('simple autopay', async () => {
    await initTests(simpleSteps);
  });

  it('comparison autopay (level1)', async () => {
    await initTests(comparisonStepsLevel1);
  });

  it('comparison autopay (level2)', async () => {
    await initTests(comparisonStepsLevel2);
  });

  it('comparison autopay (level3)', async () => {
    await initTests(comparisonStepsLevel3);
  });

  it('comparison autopay (level4)', async () => {
    await initTests(comparisonStepsLevel4);
  });
});
