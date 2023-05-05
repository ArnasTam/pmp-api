import { CreateTestCaseDto } from '@dtos/test_cases/create_test_case.dto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CreateCodeProblemDto {
  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsString({ each: true })
  public allowedCodeLanguageIds: string[];

  @ValidateNested()
  @Type(() => CreateTestCaseDto)
  testCases: CreateTestCaseDto[];
}
