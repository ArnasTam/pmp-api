import { IsString } from 'class-validator';

export class CreateCourseTagDto {
  @IsString()
  public title: string;
}
