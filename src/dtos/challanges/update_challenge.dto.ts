import { UpdateTestCaseDto } from '@dtos/test_cases/update_test_case.dto';
import { Difficulty } from '@interfaces/course.interface';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateChallengeDto {
  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsArray()
  public allowedCodeLanguageIds: string[];

  @IsArray()
  public testCases: UpdateTestCaseDto[];

  @IsNotEmpty()
  public difficulty: Difficulty;
}
