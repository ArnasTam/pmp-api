import { CourseCodeLessonDto } from '@dtos/course_code_lessons/course_code_lesson.dto';
import { CreateCourseCodeLessonDto } from '@dtos/course_code_lessons/create_course_code_lesson.dto';
import { UpdateCourseCodeLessonDto } from '@dtos/course_code_lessons/update_course_code_lesson.dto';
import { CourseCodeLessonsEntity } from '@entities/course_code_lessons.entity';
import { HttpException } from '@exceptions/HttpException';
import { Course } from '@interfaces/course.interface';
import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import CodeProblemsService from '@services/code_problems.service';
import { logger } from '@utils/logger';
import { isEmpty } from '@utils/util';

class CourseCodeLessonsService {
  private _codeProblemsService = new CodeProblemsService();

  public async getCourseCodeLessonById(id: string): Promise<CourseCodeLessonDto> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const codeLesson = await CourseCodeLessonsEntity.findOne({
      where: { id: id },
      relations: ['codeProblem', 'codeProblem.allowedCodeLanguages', 'codeProblem.testCases', 'course'],
    });

    if (!codeLesson) throw new HttpException(409, 'Course code lesson with the specified id does not exist');

    const [previousLesson, nextLesson] = await Promise.all([
      CourseCodeLessonsEntity.findOne({ where: { lessonNr: codeLesson.lessonNr - 1, course: codeLesson.course } }),
      CourseCodeLessonsEntity.findOne({ where: { lessonNr: codeLesson.lessonNr + 1, course: codeLesson.course } }),
    ]);

    return { ...codeLesson, prevLessonId: previousLesson?.id, nextLessonId: nextLesson?.id };
  }

  public async getCodeLessonsByCourseId(courseId: string): Promise<CourseCodeLessonsEntity[]> {
    if (isEmpty(courseId)) throw new HttpException(400, 'id must not be empty');

    return await CourseCodeLessonsEntity.getRepository()
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.codeProblem', 'codeProblem')
      .leftJoinAndSelect('codeProblem.testCases', 'testCases')
      .leftJoinAndSelect('codeProblem.allowedCodeLanguages', 'allowedCodeLanguages')
      .where('course.id = :courseId', { courseId })
      .orderBy('lesson.lessonNr', 'ASC')
      .getMany();
  }

  public async createCodeLessons(lessonDtos: CreateCourseCodeLessonDto[], course: Course): Promise<CourseCodeLesson[]> {
    const lessons = await Promise.all(
      lessonDtos.map(async dto => {
        const codeProblem = await this._codeProblemsService.createCodeProblem({ ...dto });

        return CourseCodeLessonsEntity.create({
          lessonNr: dto.lessonNr,
          codeProblem: codeProblem,
          course: course,
        });
      }),
    );

    return await CourseCodeLessonsEntity.save([...lessons]);
  }

  public async updateCourseCodeLessons(lessonDtos: UpdateCourseCodeLessonDto[], course: Course): Promise<CourseCodeLesson[]> {
    const courseCodeLessons = await this.getCodeLessonsByCourseId(course.id);

    await Promise.all(
      courseCodeLessons.map(async existingLesson => {
        logger.info('cia');
        if (!lessonDtos.map(dto => dto.id).includes(existingLesson.id)) {
          logger.info('cia1');
          await CourseCodeLessonsEntity.delete({ id: existingLesson.id });
        }
      }),
    );

    return await Promise.all(
      lessonDtos.map(async dto => {
        const existingLesson = courseCodeLessons.find(lesson => lesson.id === dto.id);
        if (existingLesson) {
          const codeProblem = await this._codeProblemsService.updateCodeProblem(existingLesson.codeProblem.id, dto);
          existingLesson.lessonNr = dto.lessonNr;
          existingLesson.codeProblem = codeProblem;
          await existingLesson.save();
          return existingLesson;
        } else {
          const codeProblem = await this._codeProblemsService.createCodeProblem({ ...dto });
          const newLesson = CourseCodeLessonsEntity.create({
            lessonNr: dto.lessonNr,
            codeProblem: codeProblem,
            course: course,
          });
          await newLesson.save();
          return newLesson;
        }
      }),
    );
  }
}

export default CourseCodeLessonsService;
