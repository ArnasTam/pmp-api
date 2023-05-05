import { CourseProgressMapper } from '@/mappers/course_progress.mapper';
import { CourseProgressDto } from '@dtos/course_progress/course_progress.dto';
import { CreateCourseProgressDto } from '@dtos/course_progress/create_course_progress.dto';
import { CourseProgressEntity } from '@entities/course_progress.entity';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import { CourseProgress, CourseProgressStatus } from '@interfaces/course_progress';
import AuthService from '@services/auth.service';
import CourseCodeLessonsService from '@services/course_code_lessons.service';
import CoursesService from '@services/courses.service';
import { In } from 'typeorm';

class CourseProgressService {
  private _coursesService = new CoursesService();
  private _courseCodeLessonsService = new CourseCodeLessonsService();
  private _authService = new AuthService();

  public async getCourseProgresses(userId: string): Promise<Map<string, CourseProgressDto | null>> {
    const courseProgresses: CourseProgress[] = await CourseProgressEntity.find({
      where: { userId: userId },
      relations: ['course', 'completedCodeLessons', 'course.tags', 'course.progresses'],
    });

    const courseIds = [...new Set(courseProgresses?.map(progress => progress.course.id))];
    const authorIds = [...new Set(courseProgresses?.map(progress => progress.course.authorId))];
    const result: Map<string, CourseProgressDto | null> = new Map();

    if (!courseIds) {
      return result;
    }
    const users = await this._authService.getUsersByIds([...authorIds]);

    courseIds.forEach(courseId => {
      const courseProgressesForCourse = courseProgresses.filter(cp => cp.course.id === courseId);

      let selectedCourseProgress: CourseProgress | null = null;

      if (courseProgressesForCourse.some(cp => cp.status === CourseProgressStatus.COMPLETED)) {
        selectedCourseProgress = courseProgressesForCourse.find(cp => cp.status === CourseProgressStatus.COMPLETED);
      } else if (courseProgressesForCourse.some(cp => cp.status === CourseProgressStatus.IN_PROGRESS)) {
        selectedCourseProgress = courseProgressesForCourse.find(cp => cp.status === CourseProgressStatus.IN_PROGRESS);
      } else if (courseProgressesForCourse.some(cp => cp.status === CourseProgressStatus.WITHDRAWN)) {
        selectedCourseProgress = courseProgressesForCourse.find(cp => cp.status === CourseProgressStatus.WITHDRAWN);
      }

      result.set(
        courseId,
        selectedCourseProgress && selectedCourseProgress?.userId
          ? CourseProgressMapper.mapCourseProgressToCourseProgressDto(selectedCourseProgress, users.get(selectedCourseProgress?.userId))
          : null,
      );
    });

    return result;
  }

  public async createCourseProgress(dto: CreateCourseProgressDto): Promise<CourseProgress> {
    const course = await this._coursesService.getCourseById(dto.courseId);
    const existingProgress = await CourseProgressEntity.findOne({
      where: {
        course: course,
        userId: dto.userId,
        status: In([CourseProgressStatus.IN_PROGRESS, CourseProgressStatus.COMPLETED]),
      },
    });

    if (existingProgress) {
      throw new Error(`User ${dto.userId} already has a course progress for course ${dto.courseId}`);
    }

    return CourseProgressEntity.create({
      course: course,
      userId: dto.userId,
      completedCodeLessons: [],
      status: CourseProgressStatus.IN_PROGRESS,
    }).save();
  }

  public async addCompletedLessonToProgress(courseId: string, userId: string, lesson: CourseCodeLesson): Promise<CourseProgress> {
    const courseCodeLessons = await this._courseCodeLessonsService.getCodeLessonsByCourseId(courseId);
    const courseProgress = await CourseProgressEntity.findOne({
      where: {
        course: { id: courseId },
        userId: userId,
        status: In([CourseProgressStatus.IN_PROGRESS, CourseProgressStatus.COMPLETED]),
      },
      relations: ['completedCodeLessons'],
    });

    if (!courseProgress) {
      throw new Error(`No progress found for course ${courseId} and user ${userId}`);
    }

    if (courseProgress?.completedCodeLessons?.some(completedLesson => completedLesson.id === lesson.id)) {
      return courseProgress;
    }

    courseProgress.completedCodeLessons.push(lesson);

    if (courseProgress.completedCodeLessons?.length === courseCodeLessons.length) {
      courseProgress.status = CourseProgressStatus.COMPLETED;
    }

    await courseProgress.save();

    return courseProgress;
  }
}

export default CourseProgressService;
