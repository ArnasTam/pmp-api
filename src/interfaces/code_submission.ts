import { CodeLanguage } from '@interfaces/code_language.interface';
import { CodeProblem } from '@interfaces/code_problem.interface';

export interface CodeSubmission {
  id: string;
  code: string;
  codeLanguage: CodeLanguage;
  codeProblem: CodeProblem;
  submitterId: string;
}
