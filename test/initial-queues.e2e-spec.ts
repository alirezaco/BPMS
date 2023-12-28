import { INestApplication } from '@nestjs/common';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { JOBS_QUEUE } from 'infrastructure/constants';
import { InitialJobsQueue } from 'application/services';

describe('InitialJobs (e2e)', () => {
  let app: INestApplication;
  let initialJobQueue: InitialJobsQueue;
  let jobsQueue: Queue;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-initial-queue-test';
    app = await initialApp();
    await loadDbUtil(app);
    initialJobQueue = app.get<InitialJobsQueue>(InitialJobsQueue);
    jobsQueue = app.get<Queue>(getQueueToken(JOBS_QUEUE));
  });

  afterAll(async () => {
    await dropDbUtil(app);
    await app.close();
  });

  it('initial jobs', async () => {
    await initialJobQueue.reinitialJobs();

    const jobCount = await jobsQueue.getJobCounts();

    expect(
      jobCount.active +
        jobCount.completed +
        jobCount.failed +
        jobCount.delayed +
        jobCount.waiting,
    ).toBeGreaterThanOrEqual(1);

    const job = (await jobsQueue.getJobs(['active', 'waiting'])).pop();

    expect(job.data).toHaveProperty('autopayId');

    expect(job.data.autopayId).toBe(job.id);
  });
});
