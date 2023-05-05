import Judge0Client from '@/clients/judge0_client';
import { CreateJudge0SubmissionDto } from '@dtos/judge0/create_judge0_submission.dto';
import { Judge0SubmissionResponse } from '@dtos/judge0/judge0_submission_response.dto';

class Judge0Service {
  private _judge0Client = new Judge0Client();

  public async createSubmission(dto: CreateJudge0SubmissionDto): Promise<Judge0SubmissionResponse> {
    return await this._judge0Client.post<Judge0SubmissionResponse>('/submissions/?wait=true', {
      source_code: dto.sourceCode,
      language_id: dto.languageId,
      stdin: dto.stdin,
    });
  }
}

export default Judge0Service;
