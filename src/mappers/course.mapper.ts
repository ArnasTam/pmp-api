import { CourseDto } from '@dtos/courses/course.dto';
import { UserDto } from '@dtos/users/user.dto';
import { Course } from '@interfaces/course.interface';

export class CourseMapper {
  public static mapCourseToCourseDto(course: Course, user: UserDto): CourseDto {
    return {
      ...course,
      author: user,
      participantCount: course.progresses?.length ?? 0,
    };
  }

  public static mapCourseListToCourseDtoList(courses: Course[], users: Map<string, UserDto>): CourseDto[] {
    return courses.map(course => {
      return this.mapCourseToCourseDto(course, users.get(course.authorId));
    });
  }
}
