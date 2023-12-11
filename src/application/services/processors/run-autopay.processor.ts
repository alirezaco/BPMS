import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  AutoPayActivityEntity,
  AutoPayEntity,
  ComparisonStepEntity,
  DataParamEntity,
  ProcessEntity,
  StepEntity,
} from 'domain/models';
import { ApiProxy, GrpcProxy } from 'domain/services/proxies';
import {
  ActivityStatusEnum,
  ProcessStepTypeEnum,
  RunningMessageEnum,
  SourceEnum,
} from 'infrastructure/enum';
import {
  ProcessResultInterface,
  StepResultInterface,
} from 'infrastructure/interfaces';
import { ResultStep, RunningStepType } from 'infrastructure/types';
import { ComparisonUtil } from 'infrastructure/utils';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateAutopayActivityEvent } from '../events';

@Injectable()
export class RunAutopayProcessor {
  private static is_busy = false;

  //process variables
  private process: ProcessEntity;
  private data: Record<string, any>;
  private stepsImplemented: RunningStepType[];
  private RunningStep: RunningStepType;
  private responsesSteps: ResultStep[];
  private hasPayment: boolean;
  private paymentAmount: number = 0;

  constructor(
    @InjectPinoLogger(RunAutopayProcessor.name)
    private readonly logger: PinoLogger,
    private readonly apiProxy: ApiProxy,
    private readonly grpcProxy: GrpcProxy,
    private readonly eventBus: EventBus,
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

  createActivity(
    autopayId: string,
    status: ActivityStatusEnum,
    runningTime: number,
    isError: boolean,
  ) {
    const activity = new AutoPayActivityEntity({
      autopayId,
      processId: this.process.id,
      status,
      runningTime,
      successfulSteps: this.stepsImplemented,
      failedSteps: isError ? [this.RunningStep] : [],
      hasPayment: this.hasPayment,
      paymentAmount: this.paymentAmount,
      RunningStep: this.RunningStep,
      responsesSteps: this.responsesSteps,
      owner: '6292157072f600c87fe77720',
    });

    this.eventBus.publish(new CreateAutopayActivityEvent(activity));
  }

  async handleProcessError(
    error: StepResultInterface,
  ): Promise<ProcessResultInterface> {
    let isHandledError = error.isHandledError;

    if (!isHandledError && this.process.defaultFailStep) {
      const failStep = this.process.steps.find(
        (x) => x.name === this.process.defaultFailStep,
      );

      isHandledError = true;

      this.runAstep(failStep).then().catch();
    }

    return {
      success: false,
      error: error.error,
      isHandledError,
      isRetry: error.isRetry,
    };
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
      }

      if (step.isFinal) break;
    }

    return {
      success: true,
    };
  }

  async runAstep(step: StepEntity): Promise<StepResultInterface> {
    switch (step.type) {
      case ProcessStepTypeEnum.API:
        return this.ApiStepHandler(step);
      case ProcessStepTypeEnum.GRPC:
        return this.GrpcStepHandler(step);
      case ProcessStepTypeEnum.COMPARISON:
        return this.comparisonStepHandler(step);
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

  async ApiStepHandler(step: StepEntity): Promise<StepResultInterface> {
    try {
      await this.runApiStep(step);

      return {
        success: true,
      };
    } catch (error) {
      let isRetry = true;
      let isHandledError = false;

      if (step.failStep) {
        isRetry = false;
        isHandledError = true;
        this.runAstep(this.process.steps.find((x) => x.name === step.failStep))
          .then()
          .catch();
      }

      return {
        success: false,
        error,
        isHandledError,
        isRetry,
      };
    }
  }

  async runGrpcStep(step: StepEntity) {
    const payload = step.grpc.payload ? {} : undefined;
    const metadata = step.grpc.metadata ? {} : undefined;

    step.grpc.payload?.map((x) => {
      payload[x.key] = this.getValueDate(x);
    });

    step.grpc.metadata?.map((x) => {
      metadata[x.key] = this.getValueDate(x);
    });

    const { data } = await this.grpcProxy.request(step.grpc, payload, metadata);

    this.responsesSteps.push([step.name, data]);
  }

  async GrpcStepHandler(step: StepEntity): Promise<StepResultInterface> {
    try {
      await this.runGrpcStep(step);
    } catch (error) {
      let isRetry = true;
      let isHandledError = false;

      if (step.failStep) {
        isRetry = false;
        isHandledError = true;
        this.runAstep(this.process.steps.find((x) => x.name === step.failStep))
          .then()
          .catch();
      }

      return {
        success: false,
        error,
        isHandledError,
        isRetry,
      };
    }
  }

  comparisonStep(comparison: ComparisonStepEntity): boolean {
    let result = false;

    const left = comparison?.left ? this.getValueDate(comparison.left) : null;
    const right = comparison?.right
      ? this.getValueDate(comparison.right)
      : null;

    const childResult = comparison?.children?.map((x) =>
      this.comparisonStep(x),
    );

    if (childResult.length > 1) {
      result = ComparisonUtil.compare(
        comparison.func,
        childResult.pop(),
        childResult.pop(),
      );

      childResult.map(
        (x) => (result = ComparisonUtil.compare(comparison.func, result, x)),
      );
    } else if (childResult.length === 1) {
      result = childResult[0];
    }

    if (left && right) {
      if (!comparison.children.length) {
        result = ComparisonUtil.compare(comparison.func, right, left);
      } else {
        result = ComparisonUtil.compare(comparison.func, result, left);
        result = ComparisonUtil.compare(comparison.func, result, right);
      }
    }

    if (left) {
      if (!comparison.children.length) {
        result = left;
      } else {
        result = ComparisonUtil.compare(comparison.func, result, left);
      }
    }

    if (right) {
      if (!comparison.children.length) {
        result = right;
      } else {
        result = ComparisonUtil.compare(comparison.func, result, right);
      }
    }

    return result;
  }

  comparisonStepHandler(step: StepEntity): StepResultInterface {
    const res = this.comparisonStep(step.comparison);

    if (res) {
      return {
        success: true,
      };
    } else {
      let isHandledError = false;

      if (step.failStep) {
        isHandledError = true;
        this.runAstep(this.process.steps.find((x) => x.name === step.failStep))
          .then()
          .catch();
      }

      return {
        success: false,
        isHandledError,
        isRetry: false,
      };
    }
  }

  async run(
    autopay: AutoPayEntity,
    process: ProcessEntity,
    oldInstance?: AutoPayActivityEntity,
  ): Promise<ProcessResultInterface> {
    const time = Date.now();
    this.init(process, autopay.data, oldInstance);

    const result = await this.runSteps();

    if (result.success) {
      this.createActivity(
        autopay.id,
        ActivityStatusEnum.SUCCESSFUL,
        Date.now() - time,
        false,
      );
    } else {
      this.createActivity(
        autopay.id,
        ActivityStatusEnum.FAILED,
        Date.now() - time,
        true,
      );
    }

    this.clear();

    return result;
  }
}
