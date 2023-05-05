import { ChallengeDto } from '@dtos/challanges/challenge.dto';
import { UserDto } from '@dtos/users/user.dto';
import { Challenge } from '@interfaces/challange.interface';

export class ChallengeMapper {
  public static mapChallengeToChallengeDto(challenge: Challenge, user: UserDto): ChallengeDto {
    return {
      ...challenge,
      author: user,
    };
  }

  public static mapChallengeListToChallengeDtoList(challenges: Challenge[], users: Map<string, UserDto>): ChallengeDto[] {
    return challenges.map(challenge => {
      return this.mapChallengeToChallengeDto(challenge, users.get(challenge.authorId));
    });
  }
}
