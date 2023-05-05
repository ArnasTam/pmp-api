import { TestCaseResultDto } from '@dtos/test_cases/test_case_result.dto';
import { CodeSubmissionResultsStatus } from '@interfaces/code_submission_result';

export class CodeSubmissionResponseDto {
  public id: string;
  public status: CodeSubmissionResultsStatus;
  public testCaseResults: TestCaseResultDto[];
}
