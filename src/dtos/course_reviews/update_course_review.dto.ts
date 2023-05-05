import { IsString } from 'class-validator';

export class UpdateCourseReviewDto {
  @IsString()
  public content: string;
}
