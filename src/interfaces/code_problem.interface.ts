import { CodeLanguage } from '@interfaces/code_language.interface';
import { TestCase } from '@interfaces/test_case.interface';

export interface CodeProblem {
  id: string;
  title: string;
  descriptionRichText: string;
  codeEditorTemplate: string;
  testCases: TestCase[];
  allowedCodeLanguages: CodeLanguage[];
}
