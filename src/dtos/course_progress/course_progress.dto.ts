import { CourseDto } from '@dtos/courses/course.dto';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import { CourseProgressStatus } from '@interfaces/course_progress';

export interface CourseProgressDto {
  id: string;
  completedCodeLessons: CourseCodeLesson[];
  status: CourseProgressStatus;
  course: CourseDto;
}
