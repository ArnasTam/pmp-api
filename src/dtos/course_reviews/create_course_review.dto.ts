import { IsString, IsUUID } from 'class-validator';

export class CreateCourseReviewDto {
  @IsUUID()
  public courseId: string;

  @IsString()
  public content: string;
}
