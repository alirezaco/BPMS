import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ProcessQueue } from 'application/services';
import {
  AutoPayActivitySchema,
  AutoPaySchema,
  FileSchema,
  ProcessSchema,
  StepSchema,
} from 'domain/models';
import { Model } from 'mongoose';
import { initialApp } from './utils';
import {
  apiRequestMock,
  apiSteps,
  autopayMock,
  baseProcessMock,
  comparisonStepsLevel1,
  comparisonStepsLevel2,
  comparisonStepsLevel3,
  comparisonStepsLevel4,
  complexSteps,
  grpcRequestMock,
  grpcSteps,
  invalidAutopayWithRetry,
  invalidAutopayWithoutRetry,
  simpleSteps,
} from './mocks';
import { ActivityStatusEnum, ProcessingStatusEnum } from 'infrastructure/enum';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { FAILED_QUEUE } from 'infrastructure/constants';

describe('RunAutopay (e2e)', () => {
  let app: INestApplication;
  let processQueue: ProcessQueue;
  let processModel: Model<ProcessSchema>;
  let autopayModel: Model<AutoPaySchema>;
  let activityModel: Model<AutoPayActivitySchema>;
  let fileModel: Model<FileSchema>;
  let failedQueue: Queue;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-run-test';

    app = await initialApp();

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
    fileModel = app.get<Model<FileSchema>>(getModelToken(FileSchema.name));
    failedQueue = app.get<Queue>(getQueueToken(FAILED_QUEUE));
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
    await fileModel.deleteMany({});
    await activityModel.deleteMany({ autopay_id: autopayMock._id });
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

  it('grpc autopay', async () => {
    grpcRequestMock.mockImplementation(() => ({
      meta: {
        status: 200,
      },
    }));
    await fileModel.create({
      _id: '657b139ffc13ae0569ff211d',
      value: 'test1234',
      name: 'test.proto',
      owner: '657b139ffc13ae0569fa211d',
    });

    await initTests(grpcSteps);
  });

  it('api autopay', async () => {
    apiRequestMock.mockImplementation(() => ({
      data: {
        status: 200,
      },
    }));

    await initTests(apiSteps);
  });

  it('complex autopay', async () => {
    grpcRequestMock.mockImplementation(() => ({
      meta: {
        status: 200,
      },
    }));
    apiRequestMock.mockImplementation(() => ({
      data: {
        status: 200,
      },
    }));
    await fileModel.create({
      _id: '657b139ffc13ae0569ff211d',
      value: 'test1234',
      name: 'test.proto',
      owner: '657b139ffc13ae0569fa211d',
    });

    await initTests(complexSteps);
  });

  it('invalid autopay with retry', async () => {
    apiRequestMock.mockRejectedValue(() => ({
      message: '',
    }));

    await insertProcess(invalidAutopayWithRetry);

    await processQueue.execute({
      data: { autopayId: autopayMock._id.toString() },
    } as any);

    const autopay = await autopayModel.findOne({ _id: autopayMock._id });

    expect(autopay).toBeDefined();
    expect(autopay.last_run_at).not.toBe(null);
    expect(autopay.processing_status).toBe(ProcessingStatusEnum.FAILED);

    await checkExistActivity(ActivityStatusEnum.FAILED);

    const failedCount = await failedQueue.count();

    expect(failedCount).toBeGreaterThanOrEqual(1);
  });

  it('invalid autopay without retry', async () => {
    apiRequestMock.mockRejectedValue(() => ({
      message: '',
    }));

    await insertProcess(invalidAutopayWithoutRetry);

    const beforeCount = await failedQueue.count();

    await processQueue.execute({
      data: { autopayId: autopayMock._id.toString() },
    } as any);

    const afterCount = await failedQueue.count();

    const autopay = await autopayModel.findOne({ _id: autopayMock._id });

    expect(autopay).toBeDefined();
    expect(autopay.last_run_at).not.toBe(null);
    expect(autopay.processing_status).toBe(ProcessingStatusEnum.FAILED);

    await checkExistActivity(ActivityStatusEnum.FAILED);

    expect(beforeCount).toBeGreaterThanOrEqual(afterCount);
  });
});
