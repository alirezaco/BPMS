import { Injectable } from '@nestjs/common';
import { AutoPayEntity, ProcessEntity, StepEntity } from 'domain/models';
import { ResultStep, RunningStepType } from 'infrastructure/types';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RunAutopayProcessor {
  private process: ProcessEntity;
  private data: Record<string, any>;
  private stepsImplemented: RunningStepType[];
  private RunningStep: RunningStepType;
  private responsesSteps: ResultStep[];

  constructor(
    @InjectPinoLogger(RunAutopayProcessor.name)
    private readonly logger: PinoLogger,
  ) {}

  init(process: ProcessEntity, data: Record<string, any>) {
    this.process = process;
    this.data = data;
    this.stepsImplemented = [];
    this.RunningStep = null;
    this.responsesSteps = [];
  }

  clear() {
    this.process = null;
    this.data = null;
    this.stepsImplemented = null;
    this.RunningStep = null;
    this.responsesSteps = null;
  }

  async runSteps() {}

  async runAstep(step: StepEntity) {}

  async run(autopay: AutoPayEntity, process: ProcessEntity): Promise<boolean> {
    let result = false;
    this.init(process, autopay.data);

    try {
      await this.runSteps();
      result = true;
    } catch (error) {}

    this.clear();

    return result;
  }
}
