import { Injectable } from '@nestjs/common';
import {
  AutoPayActivityEntity,
  AutoPayEntity,
  DataParamEntity,
  ProcessEntity,
  StepEntity,
} from 'domain/models';
import { ApiProxy, GrpcProxy } from 'domain/services/proxies';
import { ProcessStepTypeEnum, RunningMessageEnum, SourceEnum } from 'infrastructure/enum';
import {
  ProcessResultInterface,
  StepResultInterface,
} from 'infrastructure/interfaces';
import { ResultStep, RunningStepType } from 'infrastructure/types';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RunAutopayProcessor {
  private static is_busy = false;

  //process variables
  private process: ProcessEntity;
  private data: Record<string, any>;
  private stepsImplemented: RunningStepType[];
  private RunningStep: RunningStepType;
  private responsesSteps: ResultStep[];

  constructor(
    @InjectPinoLogger(RunAutopayProcessor.name)
    private readonly logger: PinoLogger,
    private readonly apiProxy: ApiProxy,
    private readonly grpcProxy: GrpcProxy,
  ) {}

  private checkBusy() {
    if (RunAutopayProcessor.is_busy) {
      throw new Error(RunningMessageEnum.PROCESSOR_BUSY);
    }
  }

  init(
    process: ProcessEntity,
    data: Record<string, any>,
    oldInstance?: AutoPayActivityEntity,
  ) {
    this.checkBusy();

    RunAutopayProcessor.is_busy = true;

    this.process = process;
    this.data = data;
    this.stepsImplemented = oldInstance ? oldInstance.successfulSteps : [];
    this.RunningStep = oldInstance ? oldInstance.RunningStep : null;
    this.responsesSteps = oldInstance ? oldInstance.responsesSteps : [];
  }

  clear() {
    this.process = null;
    this.data = null;
    this.stepsImplemented = null;
    this.RunningStep = null;
    this.responsesSteps = null;

    RunAutopayProcessor.is_busy = false;
  }

  async runSteps(): Promise<ProcessResultInterface> {
    for (let i = this.RunningStep[1] || 0; i < this.process.steps.length; i++) {
      const step = this.process.steps[i];

      if (!this.stepsImplemented.find((x) => x[0] === step.name)) {
        continue;
      }

      if (step.isSync) {
        this.runAstep(step).then().catch();
        continue;
      }

      this.RunningStep = [step.name, i];

      const result = await this.runAstep(step);

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          isHandledError: result.isHandledError,
          isRetry: result.isRetry,
        };
      }

      if (step.isFinal) break;
    }

    return {
      success: true,
    };
  }

  async runAstep(step: StepEntity): Promise<StepResultInterface> {
    const type = step.type;

    switch (type) {
      case ProcessStepTypeEnum.API:
        return await this.runApiStep(step);
    }
  }

  getValueDate(dataParam: DataParamEntity): any {
    if (dataParam.source === SourceEnum.AUTO_PAY) {
      return this.data[dataParam.sourceKey];
    }

    if (dataParam.source === SourceEnum.PROCESS) {
      return this.process.data[dataParam.sourceKey];
    }

    const keys = dataParam.sourceKey.split('.');

    const data = this.responsesSteps.find((x) => x[0] === keys[0]);

    if (!data) {
      throw new Error(RunningMessageEnum.INVALID_STEP_TYPE);
    }

    let value = data[1];

    for (let i = 1; i < keys.length; i++) {
      value = value[keys[i]];
    }

    return value;
  }

  async runApiStep(step: StepEntity) {
    const body = step.api.body ? {} : undefined;
    const params = step.api.params ? {} : undefined;
    const headers = step.api.headers ? {} : undefined;
    const query = step.api.query ? {} : undefined;

    step.api.body?.map((x) => {
      body[x.key] = this.getValueDate(x);
    });

    step.api.params?.map((x) => {
      params[x.key] = this.getValueDate(x);
    });

    step.api.headers?.map((x) => {
      headers[x.key] = this.getValueDate(x);
    });

    step.api.query?.map((x) => {
      query[x.key] = this.getValueDate(x);
    });

    const { data } = await this.apiProxy.request({
      url: step.api.url,
      method: step.api.method,
      body,
      params,
    });

    this.responsesSteps.push([step.name, data]);
  }

  async run(
    autopay: AutoPayEntity,
    process: ProcessEntity,
    oldInstance?: AutoPayActivityEntity,
  ): Promise<ProcessResultInterface> {
    this.init(process, autopay.data, oldInstance);

    const result = await this.runSteps();

    this.clear();

    return result;
  }
}
