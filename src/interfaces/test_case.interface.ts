import { CodeProblem } from '@interfaces/code_problem.interface';

export interface TestCase {
  id: string;
  input: string;
  expectedResult: string;
  codeProblem: CodeProblem;
}
