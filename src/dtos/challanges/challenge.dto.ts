import { UserDto } from '@dtos/users/user.dto';
import { CodeProblem } from '@interfaces/code_problem.interface';
import { Difficulty } from '@interfaces/course.interface';

export interface ChallengeDto {
  id: string;
  codeProblem: CodeProblem;
  author: UserDto;
  difficulty: Difficulty;
}
