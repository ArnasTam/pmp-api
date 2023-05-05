import { CreateTestCaseDto } from '@dtos/test_cases/create_test_case.dto';
import { IsArray, IsInt, IsString } from 'class-validator';

export class CreateCourseCodeLessonDto {
  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsArray()
  public allowedCodeLanguageIds: string[];

  @IsArray()
  testCases: CreateTestCaseDto[];

  @IsInt()
  public lessonNr: number;
}
