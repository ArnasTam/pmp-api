import { CourseCodeLesson } from '@interfaces/course_code_lesson.interface';
import CourseCodeLessonsService from '@services/course_code_lessons.service';
import { NextFunction, Request, Response } from 'express';

class CourseCodeLessonsController {
  private _courseCodeLessonsService = new CourseCodeLessonsService();

  public getCourseCodeLessonsByCourseId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      const courseLessons: CourseCodeLesson[] = await this._courseCodeLessonsService.getCodeLessonsByCourseId(courseId);

      res.status(200).json({ data: courseLessons });
    } catch (error) {
      next(error);
    }
  };

  public getCourseCodeLessonById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeLessonId = req.params.codeLessonId;
      const courseLesson: CourseCodeLesson = await this._courseCodeLessonsService.getCourseCodeLessonById(codeLessonId);

      res.status(200).json(courseLesson);
    } catch (error) {
      next(error);
    }
  };
}

export default CourseCodeLessonsController;
