import {JobProgressDTO, JobProgressLogDTO, JobProgressStates} from '../../../../common/entities/job/JobProgressDTO';


export class JobProgress {
  private steps = {
    all: 0,
    processed: 0,
    skipped: 0,
  };
  private state = JobProgressStates.running;
  private time = {
    start: <number>Date.now(),
    end: <number>null,
  };
  private logCounter = 0;
  private logs: { id: number, timestamp: string, comment: string }[] = [];


  constructor(public readonly HashName: string) {
  }

  set OnChange(val: (progress: JobProgress) => void) {
    this.onChange = val;
  }

  get Skipped(): number {
    return this.steps.skipped;
  }

  set Skipped(value: number) {
    this.steps.skipped = value;
    this.time.end = Date.now();
    this.onChange(this);
  }

  get Processed(): number {
    return this.steps.processed;
  }

  set Processed(value: number) {
    this.steps.processed = value;
    this.time.end = Date.now();
    this.onChange(this);
  }

  get Left(): number {
    return this.steps.all - this.steps.processed - this.steps.skipped;
  }

  set Left(value: number) {
    this.steps.all = value + this.steps.skipped + this.steps.processed;
    this.time.end = Date.now();
    this.onChange(this);
  }

  get All(): number {
    return this.steps.all;
  }

  set All(value: number) {
    this.steps.all = value;
    this.time.end = Date.now();
    this.onChange(this);
  }

  get State(): JobProgressStates {
    return this.state;
  }

  set State(value: JobProgressStates) {
    this.state = value;
    this.time.end = Date.now();
    this.onChange(this);
  }

  get Logs(): JobProgressLogDTO[] {
    return this.logs;
  }

  onChange = (progress: JobProgress) => {
  };

  log(log: string) {
    while (this.logs.length > 10) {
      this.logs.shift();
    }
    this.logs.push({id: this.logCounter++, timestamp: (new Date()).toISOString(), comment: log});
    this.onChange(this);
  }

  toDTO(): JobProgressDTO {
    return {
      HashName: this.HashName,
      state: this.state,
      time: {
        start: this.time.start,
        end: this.time.end
      },
      logs: this.logs,
      steps: this.steps
    };
  }
}