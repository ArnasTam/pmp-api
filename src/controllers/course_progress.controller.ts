import { CourseProgressDto } from '@dtos/course_progress/course_progress.dto';
import { CourseProgress } from '@interfaces/course_progress';
import AuthService from '@services/auth.service';
import CourseProgressService from '@services/course_progress.service';
import { NextFunction, Request, Response } from 'express';

class CourseProgressController {
  private _courseCodeLessonsService = new CourseProgressService();
  private _authService = new AuthService();

  public getCourseProgresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tokenSubject } = await this._authService.getClaims(req);

      const courseProgress: Map<string, CourseProgressDto | null> = await this._courseCodeLessonsService.getCourseProgresses(tokenSubject);

      res.status(200).json(Object.fromEntries(courseProgress));
    } catch (error) {
      next(error);
    }
  };

  public createCourseProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body;
      const courseProgress: CourseProgress = await this._courseCodeLessonsService.createCourseProgress(dto);

      res.status(200).json({ ...courseProgress });
    } catch (error) {
      next(error);
    }
  };
}

export default CourseProgressController;
