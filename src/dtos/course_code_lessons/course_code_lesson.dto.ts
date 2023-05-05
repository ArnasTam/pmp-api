import { CodeProblem } from '@interfaces/code_problem.interface';

export interface CourseCodeLessonDto {
  id: string;
  codeProblem: CodeProblem;
  lessonNr: number;
  nextLessonId: string;
  prevLessonId: string;
}
