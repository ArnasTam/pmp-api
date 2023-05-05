import { CodeSubmissionResponseDto } from '@dtos/code_submissions/code_submission_response.dto';
import { TestCaseResultDto } from '@dtos/test_cases/test_case_result.dto';
import { CodeSubmissionResult } from '@interfaces/code_submission_result';
import { TestCaseResult } from '@interfaces/test_case_result';

export class CodeSubmissionMapper {
  public static map(input: CodeSubmissionResult): CodeSubmissionResponseDto {
    return { id: input.id, status: input.status, testCaseResults: input.testCaseResults.map(testCase => this.mapTestCase(testCase)) };
  }

  private static mapTestCase(input: TestCaseResult): TestCaseResultDto {
    return {
      compileOutput: input.compileOutput,
      error: input.error,
      expectedOutput: input.testCase.expectedResult,
      id: input.id,
      output: input.output,
      status: input.status,
    };
  }
}
