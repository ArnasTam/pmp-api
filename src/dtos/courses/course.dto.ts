import { UserDto } from '@dtos/users/user.dto';
import { Difficulty } from '@interfaces/course.interface';
import { CourseTag } from '@interfaces/course_tag.interface';

export interface CourseDto {
  id: string;
  title: string;
  descriptionRichText: string;
  estimatedTimeOfCompletion: number;
  participantCount: number;
  author: UserDto;
  difficulty: Difficulty;
  tags: CourseTag[];
}
