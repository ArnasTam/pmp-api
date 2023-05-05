import { CreateCodeSubmissionDto } from '@dtos/code_submissions/create_code_submission.dto';
import AuthService from '@services/auth.service';
import ChallengeCodeSubmissionsService from '@services/challenge_code_submissions.service';
import { NextFunction, Request, Response } from 'express';

class ChallengeCodeSubmissionsController {
  private _challengeCodeSubmissionsService = new ChallengeCodeSubmissionsService();
  private _authService = new AuthService();

  public createCodeSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codeSubmissionDto: CreateCodeSubmissionDto = req.body;
      const { tokenSubject } = await this._authService.getClaims(req);

      const result = await this._challengeCodeSubmissionsService.createCodeSubmission(codeSubmissionDto, tokenSubject);

      res.status(200).json({ ...result });
    } catch (error) {
      next(error);
    }
  };
}

export default ChallengeCodeSubmissionsController;
