import { CourseProgress } from '@interfaces/course_progress';
import { CourseTag } from '@interfaces/course_tag.interface';

export interface Course {
  id: string;
  title: string;
  authorId: string;
  descriptionRichText: string;
  estimatedTimeOfCompletion: number;
  difficulty: Difficulty;
  tags: CourseTag[];
  progresses: CourseProgress[];
}

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
}
