import { CodeSubmissionResult } from '@interfaces/code_submission_result';
import { TestCase } from '@interfaces/test_case.interface';

export enum TestCaseResultStatus {
  PASS,
  FAIL,
  ERROR,
}

export interface TestCaseResult {
  id: string;
  testCase: TestCase;
  error?: string;
  compileOutput?: string;
  output?: string;
  status: TestCaseResultStatus;
  codeSubmissionResult: CodeSubmissionResult;
}
