import { Course } from '@interfaces/course.interface';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';

export enum CourseProgressStatus {
  IN_PROGRESS,
  COMPLETED,
  WITHDRAWN,
}

export interface CourseProgress {
  id: string;
  completedCodeLessons: CourseCodeLesson[];
  status: CourseProgressStatus;
  course: Course;
  userId: string;
}
