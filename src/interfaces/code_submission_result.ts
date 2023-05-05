import { CodeSubmission } from '@interfaces/code_submission';
import { TestCaseResult } from '@interfaces/test_case_result';

export enum CodeSubmissionResultsStatus {
  SUCCESS,
  FAILURE,
}

export interface CodeSubmissionResult {
  id: string;
  codeSubmission: CodeSubmission;
  testCaseResults: TestCaseResult[];
  status: CodeSubmissionResultsStatus;
}
