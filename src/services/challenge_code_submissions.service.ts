import { CodeSubmissionResponseDto } from '@dtos/code_submissions/code_submission_response.dto';
import { CreateCodeSubmissionDto } from '@dtos/code_submissions/create_code_submission.dto';
import CodeSubmissionsService from '@services/code_submissions.service';

class ChallengeCodeSubmissionsService {
  private _codeSubmissionService = new CodeSubmissionsService();

  public async createCodeSubmission(codeSubmissionDto: CreateCodeSubmissionDto, submitterId: string): Promise<CodeSubmissionResponseDto> {
    return await this._codeSubmissionService.createCodeSubmission(codeSubmissionDto, submitterId);
  }
}

export default ChallengeCodeSubmissionsService;
