import { CreateCourseCodeSubmissionDto } from '@dtos/code_submissions/create_course_code_submission.dto';
import AuthService from '@services/auth.service';
import CourseCodeSubmissionsService from '@services/course_code_submissions.service';
import { NextFunction, Request, Response } from 'express';

class CourseCodeSubmissionsController {
  private _codeSubmissionsService = new CourseCodeSubmissionsService();
  private _authService = new AuthService();

  public createCodeSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeSubmissionDto: CreateCourseCodeSubmissionDto = req.body;
      const { tokenSubject } = await this._authService.getClaims(req);

      const result = await this._codeSubmissionsService.createCodeSubmission(codeSubmissionDto, tokenSubject);

      res.status(200).json({ ...result });
    } catch (error) {
      next(error);
    }
  };
}

export default CourseCodeSubmissionsController;
