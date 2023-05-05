import { CodeProblem } from '@interfaces/code_problem.interface';
import { Difficulty } from '@interfaces/course.interface';

export interface Challenge {
  id: string;
  codeProblem: CodeProblem;
  difficulty: Difficulty;
  authorId: string;
}
