import { IsString, IsUUID } from 'class-validator';

export class CreateCodeSubmissionDto {
  @IsString()
  public code: string;

  @IsUUID()
  public codeLanguageId: string;

  @IsUUID()
  public codeProblemId: string;
}
