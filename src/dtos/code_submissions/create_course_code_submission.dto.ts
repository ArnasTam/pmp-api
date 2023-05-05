import { IsString, IsUUID } from 'class-validator';

export class CreateCourseCodeSubmissionDto {
  @IsString()
  public code: string;

  @IsUUID()
  public courseId: string;

  @IsUUID()
  public lessonId: string;

  @IsUUID()
  public codeLanguageId: string;

  @IsUUID()
  public codeProblemId: string;
}
