import { CreateCourseCodeLessonDto } from '@dtos/course_code_lessons/create_course_code_lesson.dto';
import { Difficulty } from '@interfaces/course.interface';
import { IsArray, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
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
  public codeLessons: CreateCourseCodeLessonDto[];
}
