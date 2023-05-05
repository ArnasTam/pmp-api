import { CreateTestCaseDto } from '@dtos/test_cases/create_test_case.dto';
import { Difficulty } from '@interfaces/course.interface';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsArray()
  public allowedCodeLanguageIds: string[];

  @IsArray()
  public testCases: CreateTestCaseDto[];

  @IsNotEmpty()
  public difficulty: Difficulty;
}
