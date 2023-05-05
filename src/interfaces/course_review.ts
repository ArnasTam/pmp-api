import { Course } from '@interfaces/course.interface';

export interface CourseReview {
  id: string;
  authorId: string;
  content: string;
  course: Course;
}
