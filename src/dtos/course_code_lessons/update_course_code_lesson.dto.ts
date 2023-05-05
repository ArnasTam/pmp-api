import { UpdateTestCaseDto } from '@dtos/test_cases/update_test_case.dto';
import { IsArray, IsInt, IsString } from 'class-validator';

export class UpdateCourseCodeLessonDto {
  @IsString()
  public id: string;

  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsArray()
  public allowedCodeLanguageIds: string[];

  @IsArray()
  testCases: UpdateTestCaseDto[];

  @IsInt()
  public lessonNr: number;
}
