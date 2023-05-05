import { UserDto } from '@dtos/users/user.dto';
import { User } from 'auth0';

export class Auth0Mapper {
  public static mapUserToUserDto(user: User): UserDto {
    return {
      id: user.user_id,
      email: user.email,
      picture: user.picture,
    };
  }

  public static mapUserListToUserDto(users: User[]): Map<string, UserDto> {
    const userDtoMap = new Map<string, UserDto>();
    for (const user of users) {
      userDtoMap.set(user.user_id, this.mapUserToUserDto(user));
    }
    return userDtoMap;
  }
}
