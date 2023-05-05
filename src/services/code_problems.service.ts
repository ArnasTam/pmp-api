import { CreateCodeProblemDto } from '@dtos/code_problems/create_code_problem.dto';
import { UpdateCodeProblemDto } from '@dtos/code_problems/update_code_problem.dto';
import { CodeProblemsEntity } from '@entities/code_problems.entity';
import { TestCasesEntity } from '@entities/test_cases.entity';
import { HttpException } from '@exceptions/HttpException';
import { CodeProblem } from '@interfaces/code_problem.interface';
import CodeLanguagesService from '@services/code_languages.service';
import { isEmpty } from '@utils/util';

class CodeProblemsService {
  private _codeLanguagesService = new CodeLanguagesService();

  public async getCodeProblemById(id: string): Promise<CodeProblem> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const codeProblem: CodeProblem = await CodeProblemsEntity.findOne({ where: { id: id }, relations: ['testCases'] });
    if (!codeProblem) throw new HttpException(409, 'Code problem with the specified id does not exist');

    return codeProblem;
  }

  public async createCodeProblem(codeProblemDto: CreateCodeProblemDto): Promise<CodeProblem> {
    const allowedCodeLanguages = await this._codeLanguagesService.getCodeLanguagesByIds(codeProblemDto.allowedCodeLanguageIds);

    const codeProblemEntity = await CodeProblemsEntity.create({
      allowedCodeLanguages: allowedCodeLanguages,
      ...codeProblemDto,
    }).save();

    const testCaseEntities =
      codeProblemDto.testCases.map(dto =>
        TestCasesEntity.create({
          input: dto.input,
          expectedResult: dto.expectedResult,
          codeProblem: codeProblemEntity,
        }),
      ) ?? [];

    codeProblemEntity.testCases = testCaseEntities;
    const codeProblem = await codeProblemEntity.save();
    await TestCasesEntity.save(testCaseEntities);

    return codeProblem;
  }

  async updateCodeProblem(id: string, updateCodeProblemDto: UpdateCodeProblemDto): Promise<CodeProblem> {
    const codeProblemRepo = CodeProblemsEntity.getRepository();
    const testCaseRepo = TestCasesEntity.getRepository();
    const { allowedCodeLanguageIds, testCases, codeEditorTemplate, descriptionRichText, title } = updateCodeProblemDto;

    const codeProblem = await codeProblemRepo.findOneOrFail(id, {
      relations: ['testCases'],
    });

    codeProblem.allowedCodeLanguages = await this._codeLanguagesService.getCodeLanguagesByIds(allowedCodeLanguageIds);
    codeProblem.codeEditorTemplate = codeEditorTemplate;
    codeProblem.descriptionRichText = descriptionRichText;
    codeProblem.title = title;

    const updatedCodeProblem = await codeProblem.save();

    const updatedTestCases = await Promise.all(
      testCases?.map(async testCase => {
        const testCaseEntity = await testCaseRepo.findOne({ where: { id: testCase.id }, relations: ['codeProblem'] });

        if (testCaseEntity) {
          testCaseEntity.expectedResult = testCase.expectedResult;
          testCaseEntity.input = testCase.input;

          return await testCaseEntity.save();
        } else {
          const newTestCase = TestCasesEntity.create({
            input: testCase.input,
            expectedResult: testCase.expectedResult,
            codeProblem: updatedCodeProblem,
          });

          return testCaseRepo.save(newTestCase);
        }
      }) ?? [],
    );

    updatedCodeProblem.testCases = [...updatedTestCases];

    return updatedCodeProblem.save();
  }
}

export default CodeProblemsService;
