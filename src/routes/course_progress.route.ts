import CourseProgressController from '@controllers/course_progress.controller';
import { CreateCourseProgressDto } from '@dtos/course_progress/create_course_progress.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CourseProgressRoute implements Routes {
  public router = Router();
  public basePath = '/course-progress';
  private _courseProgressController = new CourseProgressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.basePath}`, authMiddleware, this._courseProgressController.getCourseProgresses);
    this.router.post(
      `${this.basePath}`,
      authMiddleware,
      validationMiddleware(CreateCourseProgressDto, 'body'),
      this._courseProgressController.createCourseProgress,
    );
  }
}

export default CourseProgressRoute;
