import { UpdateTestCaseDto } from '@dtos/test_cases/update_test_case.dto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class UpdateCodeProblemDto {
  @IsString()
  public title: string;

  @IsString()
  public descriptionRichText: string;

  @IsString()
  public codeEditorTemplate: string;

  @IsString({ each: true })
  public allowedCodeLanguageIds: string[];

  @ValidateNested()
  @Type(() => UpdateTestCaseDto)
  testCases: UpdateTestCaseDto[];
}
