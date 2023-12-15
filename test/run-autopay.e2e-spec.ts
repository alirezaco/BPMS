import { INestApplication } from '@nestjs/common';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { InitialJobsCron } from 'application/services';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { JOBS_QUEUE } from 'infrastructure/constants';

describe('RunAutopay (e2e)', () => {
  let app: INestApplication;
  let initialJobCron: InitialJobsCron;
  let jobsQueue: Queue;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-run-autopay-test';
    app = await initialApp();
    await loadDbUtil(app);
    initialJobCron = app.get<InitialJobsCron>(InitialJobsCron);
    jobsQueue = app.get<Queue>(getQueueToken(JOBS_QUEUE));
  });

  afterAll(async () => {
    await dropDbUtil(app);
  });

  it('initial hourly queue', async () => {
    await initialJobCron.executeHourly();

    const jobCount = await jobsQueue.getJobCounts();

    expect(
      jobCount.active +
        jobCount.completed +
        jobCount.failed +
        jobCount.delayed +
        jobCount.waiting,
    ).toBeGreaterThanOrEqual(2);

    const job = (await jobsQueue.getActive()).pop();

    expect(job.data).toHaveProperty('autopayId');

    expect(job.data.autopayId).toBe(job.id);
  });

  it('initial daily queue', async () => {
    await initialJobCron.executeDaily();

    const jobCount = await jobsQueue.getJobCounts();

    expect(
      jobCount.active +
        jobCount.completed +
        jobCount.failed +
        jobCount.delayed +
        jobCount.waiting,
    ).toBeGreaterThanOrEqual(2);

    const job = (await jobsQueue.getActive()).pop();

    expect(job.data).toHaveProperty('autopayId');

    expect(job.data.autopayId).toBe(job.id);
  });

  it('initial weekly queue', async () => {
    await initialJobCron.executeWeekly();

    const jobCount = await jobsQueue.getJobCounts();

    expect(
      jobCount.active +
        jobCount.completed +
        jobCount.failed +
        jobCount.delayed +
        jobCount.waiting,
    ).toBeGreaterThanOrEqual(2);

    const job = (await jobsQueue.getActive()).pop();

    expect(job.data).toHaveProperty('autopayId');

    expect(job.data.autopayId).toBe(job.id);
  });

  it('initial monthly queue', async () => {
    await initialJobCron.executeMonthly();

    const jobCount = await jobsQueue.getJobCounts();

    expect(
      jobCount.active +
        jobCount.completed +
        jobCount.failed +
        jobCount.delayed +
        jobCount.waiting,
    ).toBeGreaterThanOrEqual(2);

    const job = (await jobsQueue.getActive()).pop();

    expect(job.data).toHaveProperty('autopayId');

    expect(job.data.autopayId).toBe(job.id);
  });
});
