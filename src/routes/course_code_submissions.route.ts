import CourseCodeSubmissionsController from '@controllers/course_code_submissions.controller';
import { CreateCourseCodeSubmissionDto } from '@dtos/code_submissions/create_course_code_submission.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CourseCodeSubmissionsRoute implements Routes {
  public router = Router();
  private _path = '/course-code-submissions';
  private _codeSubmissionsController = new CourseCodeSubmissionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this._path}`,
      authMiddleware,
      validationMiddleware(CreateCourseCodeSubmissionDto, 'body'),
      this._codeSubmissionsController.createCodeSubmission,
    );
  }
}

export default CourseCodeSubmissionsRoute;
