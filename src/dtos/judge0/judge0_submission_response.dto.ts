export class Judge0SubmissionResponse {
  public stdout: string;
  public time: number;
  public memory: number;
  public stderr: string;
  public token: string;
  public compile_output: string;
  public message: string;
  public status: Judge0SubmissionStatus;
}

export class Judge0SubmissionStatus {
  public id: number;
  public description: string;
}
