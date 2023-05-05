import { UpdateCourseCodeLessonDto } from '@dtos/course_code_lessons/update_course_code_lesson.dto';
import { Difficulty } from '@interfaces/course.interface';
import { IsArray, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  public title: string;

  @IsString()
  @IsJSON()
  public descriptionRichText: string;

  @IsNotEmpty()
  public difficulty: Difficulty;

  @IsInt()
  public estimatedTimeOfCompletion: number;

  @IsOptional()
  public tagIds: string[];

  @IsArray()
  public codeLessons: UpdateCourseCodeLessonDto[];
}
