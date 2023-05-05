import { ChallengeMapper } from '@/mappers/challenges.mapper';
import { ChallengeDto } from '@dtos/challanges/challenge.dto';
import { CreateChallengeDto } from '@dtos/challanges/create_challange.dto';
import { UpdateChallengeDto } from '@dtos/challanges/update_challenge.dto';
import { ChallengesEntity } from '@entities/challenges.entity';
import { HttpException } from '@exceptions/HttpException';
import { Challenge } from '@interfaces/challange.interface';
import AuthService from '@services/auth.service';
import CodeProblemsService from '@services/code_problems.service';
import { isEmpty } from '@utils/util';

class ChallengesService {
  private _codeProblemsService = new CodeProblemsService();
  private _authService = new AuthService();

  public async getChallenges(authorId?: string): Promise<ChallengeDto[]> {
    let challenges;

    if (authorId) {
      challenges = await ChallengesEntity.find({
        where: { authorId },
        relations: ['codeProblem', 'codeProblem.allowedCodeLanguages', 'codeProblem.testCases'],
      });
    } else {
      challenges = await ChallengesEntity.find({ relations: ['codeProblem', 'codeProblem.allowedCodeLanguages', 'codeProblem.testCases'] });
    }

    const users = await this._authService.getUsersByIds(challenges.map(course => course.authorId));

    return ChallengeMapper.mapChallengeListToChallengeDtoList(challenges, users);
  }

  public async getChallengeById(id: string): Promise<ChallengeDto> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const challenge: Challenge = await ChallengesEntity.findOne({
      where: { id: id },
      relations: ['codeProblem', 'codeProblem.allowedCodeLanguages', 'codeProblem.testCases'],
    });
    if (!challenge) throw new HttpException(409, 'Challenge with the specified id does not exist');

    const users = await this._authService.getUsersByIds([challenge.authorId]);

    return ChallengeMapper.mapChallengeToChallengeDto(challenge, users.get(challenge.authorId));
  }

  public async createChallenge(authorId: string, challengeDto: CreateChallengeDto): Promise<Challenge> {
    const codeProblem = await this._codeProblemsService.createCodeProblem({ ...challengeDto });

    return ChallengesEntity.create({
      ...challengeDto,
      codeProblem: codeProblem,
      authorId: authorId,
    }).save();
  }

  public async updateChallenge(id: string, challengeDto: UpdateChallengeDto, callerId: string): Promise<Challenge> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const challenge: ChallengesEntity = await ChallengesEntity.findOne({ where: { id: id }, relations: ['codeProblem'] });
    if (!challenge) throw new HttpException(409, 'Challenge with the specified id does not exist');
    if (callerId !== challenge.authorId) throw new HttpException(403, 'No Permission');

    challenge.codeProblem = await this._codeProblemsService.updateCodeProblem(challenge.codeProblem.id, challengeDto);
    challenge.difficulty = challengeDto.difficulty;

    return challenge.save();
  }

  public async deleteChallenge(id: string, callerId: string): Promise<Challenge> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const challenge: ChallengesEntity = await ChallengesEntity.findOne({ where: { id: id } });
    if (!challenge) throw new HttpException(409, 'Challenge with the specified id does not exist');
    if (callerId !== challenge.authorId) throw new HttpException(403, 'No Permission');

    return challenge.remove();
  }
}

export default ChallengesService;
