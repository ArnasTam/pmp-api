import { TestCaseResultStatus } from '@interfaces/test_case_result';

export class TestCaseResultDto {
  public id: string;
  public error: string;
  public expectedOutput: string;
  public output: string;
  public compileOutput: string;
  public status: TestCaseResultStatus;
}
