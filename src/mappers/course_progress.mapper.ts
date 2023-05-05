import { CourseMapper } from '@/mappers/course.mapper';
import { CourseProgressDto } from '@dtos/course_progress/course_progress.dto';
import { UserDto } from '@dtos/users/user.dto';
import { CourseProgress } from '@interfaces/course_progress';

export class CourseProgressMapper {
  public static mapCourseProgressToCourseProgressDto(progress: CourseProgress, user: UserDto): CourseProgressDto {
    return {
      completedCodeLessons: progress.completedCodeLessons,
      course: CourseMapper.mapCourseToCourseDto(progress.course, user),
      id: progress.id,
      status: progress.status,
    };
  }
}
