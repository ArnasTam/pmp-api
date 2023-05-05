import { CodeProblem } from '@interfaces/code_problem.interface';

export interface CourseCodeLesson {
  id: string;
  codeProblem: CodeProblem;
  lessonNr: number;
}
