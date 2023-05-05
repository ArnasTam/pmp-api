import { CourseMapper } from '@/mappers/course.mapper';
import { CourseDto } from '@dtos/courses/course.dto';
import { CreateCourseDto } from '@dtos/courses/create_course.dto';
import { UpdateCourseDto } from '@dtos/courses/update_course.dto';
import { CoursesEntity } from '@entities/courses.entity';
import { Course } from '@interfaces/course.interface';
import { HttpException } from '@exceptions/HttpException';
import AuthService from '@services/auth.service';
import CourseCodeLessonsService from '@services/course_code_lessons.service';
import CourseTagsService from '@services/course_tags.service';
import { isEmpty } from '@utils/util';

class CoursesService {
  private _courseTagsService = new CourseTagsService();
  private _courseCodeLessonsService = new CourseCodeLessonsService();
  private _authService = new AuthService();

  public async getCourses(authorId?: string): Promise<CourseDto[]> {
    let courses;

    if (authorId) {
      courses = await CoursesEntity.find({
        where: { authorId },
        relations: ['tags', 'progresses'],
      });
    } else {
      courses = await CoursesEntity.find({ relations: ['tags', 'progresses'] });
    }

    const users = await this._authService.getUsersByIds(courses.map(course => course.authorId));

    return CourseMapper.mapCourseListToCourseDtoList(courses, users);
  }

  public async getCourseById(id: string): Promise<CourseDto> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const course: Course = await CoursesEntity.findOne({
      where: { id: id },
      relations: ['tags', 'codeLessons', 'codeLessons.codeProblem', 'codeLessons.codeProblem.testCases'],
    });
    if (!course) throw new HttpException(409, 'Course with the specified id does not exist');
    const users = await this._authService.getUsersByIds([course.authorId]);

    return CourseMapper.mapCourseToCourseDto(course, users.get(course.authorId));
  }

  public async createCourse(authorId: string, data: CreateCourseDto): Promise<Course> {
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId must not be empty');

    const course = CoursesEntity.create({
      ...data,
      authorId: authorId,
    });
    course.tags = data.tagIds.length ? await this._courseTagsService.getCourseTagsByIds(data.tagIds) : null;
    course.codeLessons = await this._courseCodeLessonsService.createCodeLessons(data.codeLessons, course);

    return await course.save();
  }

  public async updateCourse(id: string, updateCourseDto: UpdateCourseDto, callerId: string): Promise<Course> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const course: CoursesEntity = await CoursesEntity.findOne({ where: { id } });
    if (!course) throw new HttpException(409, 'Course with the specified id does not exist');
    if (callerId !== course.authorId) throw new HttpException(403, 'No Permission');

    const { title, descriptionRichText, estimatedTimeOfCompletion, tagIds, difficulty } = updateCourseDto;

    course.title = title ?? course.title;
    course.descriptionRichText = descriptionRichText ?? course.descriptionRichText;
    course.estimatedTimeOfCompletion = estimatedTimeOfCompletion ?? course.estimatedTimeOfCompletion;
    course.difficulty = difficulty ?? course.difficulty;
    course.tags = tagIds.length ? await this._courseTagsService.getCourseTagsByIds(tagIds) : course.tags;
    await this._courseCodeLessonsService.updateCourseCodeLessons(updateCourseDto.codeLessons, course);

    return await course.save();
  }

  public async deleteCourse(id: string, callerId: string): Promise<Course> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const course: Course = await CoursesEntity.findOne({ where: { id: id } });
    if (!course) throw new HttpException(409, 'Course with the specified id does not exist');
    if (callerId !== course.authorId) throw new HttpException(403, 'No Permission');

    await CoursesEntity.delete({ id: id });
    return course;
  }
}

export default CoursesService;
