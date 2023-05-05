import { CodeSubmissionResponseDto } from '@dtos/code_submissions/code_submission_response.dto';
import { CreateCourseCodeSubmissionDto } from '@dtos/code_submissions/create_course_code_submission.dto';
import { CodeSubmissionResultsStatus } from '@interfaces/code_submission_result';
import CodeSubmissionsService from '@services/code_submissions.service';
import CourseCodeLessonsService from '@services/course_code_lessons.service';
import CourseProgressService from '@services/course_progress.service';

class CourseCodeSubmissionsService {
  private _codeSubmissionService = new CodeSubmissionsService();
  private _courseProgressService = new CourseProgressService();
  private _courseCodeLessonService = new CourseCodeLessonsService();

  public async createCodeSubmission(codeSubmissionDto: CreateCourseCodeSubmissionDto, submitterId: string): Promise<CodeSubmissionResponseDto> {
    const lesson = await this._courseCodeLessonService.getCourseCodeLessonById(codeSubmissionDto.lessonId);
    const submissionResult = await this._codeSubmissionService.createCodeSubmission(codeSubmissionDto, submitterId);

    if (submissionResult.status === CodeSubmissionResultsStatus.SUCCESS) {
      await this._courseProgressService.addCompletedLessonToProgress(codeSubmissionDto.courseId, submitterId, lesson);
    }

    return submissionResult;
  }
}

export default CourseCodeSubmissionsService;
