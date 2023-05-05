import { CodeSubmissionMapper } from '@/mappers/code_submission.mapper';
import { CodeSubmissionResponseDto } from '@dtos/code_submissions/code_submission_response.dto';
import { CreateCodeSubmissionDto } from '@dtos/code_submissions/create_code_submission.dto';
import { CodeSubmissionsEntity } from '@entities/code_submissions.entity';
import { CodeSubmissionResultsEntity } from '@entities/code_submissions_results.entity';
import { TestCaseResultsEntity } from '@entities/test_case_results.entity';
import { HttpException } from '@exceptions/HttpException';
import { CodeSubmissionResultsStatus } from '@interfaces/code_submission_result';
import { TestCaseResultStatus } from '@interfaces/test_case_result';
import CodeLanguagesService from '@services/code_languages.service';
import CodeProblemsService from '@services/code_problems.service';
import Judge0Service from '@services/judge0.service';
import { isEmpty } from '@utils/util';

class CodeSubmissionsService {
  private _codeLanguagesService = new CodeLanguagesService();
  private _codeProblemsService = new CodeProblemsService();
  private _judge0Service = new Judge0Service();

  public async createCodeSubmission(codeSubmissionDto: CreateCodeSubmissionDto, submitterId: string): Promise<CodeSubmissionResponseDto> {
    if (isEmpty(submitterId)) throw new HttpException(400, 'submitterId must not be empty');

    const codeLanguage = await this._codeLanguagesService.getCodeLanguageById(codeSubmissionDto.codeLanguageId);
    const codeProblem = await this._codeProblemsService.getCodeProblemById(codeSubmissionDto.codeProblemId);

    const codeSubmission = await CodeSubmissionsEntity.create({
      code: codeSubmissionDto.code,
      codeLanguage,
      codeProblem,
      submitterId,
    }).save();

    const codeSubmissionResult = await CodeSubmissionResultsEntity.create({
      codeSubmission,
    }).save();

    let testCaseResults: TestCaseResultsEntity[] = [];
    await Promise.all(
      codeProblem.testCases.map(async testCase => {
        const submissionResponse = await this._judge0Service.createSubmission({
          languageId: codeLanguage.compilerId,
          sourceCode: codeSubmissionDto.code,
          stdin: testCase.input,
        });

        const resultMatches = submissionResponse?.stdout?.replace(/\n/g, '') === testCase.expectedResult;

        testCaseResults = [
          ...testCaseResults,
          TestCaseResultsEntity.create({
            codeSubmissionResult: codeSubmissionResult,
            error: submissionResponse.stderr,
            output: submissionResponse.stdout,
            compileOutput: submissionResponse.compile_output,
            status: this.getResultStatus(submissionResponse.stderr, resultMatches),
            testCase,
          }),
        ];
      }),
    );

    const isSubmissionUnsuccessful = testCaseResults.some(testCaseResult => testCaseResult.status !== TestCaseResultStatus.PASS);
    codeSubmissionResult.status = isSubmissionUnsuccessful ? CodeSubmissionResultsStatus.FAILURE : CodeSubmissionResultsStatus.SUCCESS;

    codeSubmissionResult.testCaseResults = testCaseResults;
    await codeSubmissionResult.save();
    await TestCaseResultsEntity.save(testCaseResults);

    return CodeSubmissionMapper.map(codeSubmissionResult);
  }

  private getResultStatus(error: string, resultMatches: boolean): TestCaseResultStatus {
    if (error) {
      return TestCaseResultStatus.ERROR;
    }

    return resultMatches ? TestCaseResultStatus.PASS : TestCaseResultStatus.FAIL;
  }
}

export default CodeSubmissionsService;
