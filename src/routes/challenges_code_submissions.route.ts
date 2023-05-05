import ChallengeCodeSubmissionsController from '@controllers/challenge_code_submissions.controller';
import { CreateCodeSubmissionDto } from '@dtos/code_submissions/create_code_submission.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class ChallengeCodeSubmissionsRoute implements Routes {
  public router = Router();
  private _path = '/challenge-code-submissions';
  private _codeSubmissionsController = new ChallengeCodeSubmissionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this._path}`,
      authMiddleware,
      validationMiddleware(CreateCodeSubmissionDto, 'body'),
      this._codeSubmissionsController.createCodeSubmission,
    );
  }
}

export default ChallengeCodeSubmissionsRoute;
