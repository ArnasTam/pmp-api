import Auth0Client from '@/clients/auth0_client';
import { Auth0Mapper } from '@/mappers/auth0.mapper';
import { UserDto } from '@dtos/users/user.dto';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { DataStoredInToken } from '@interfaces/auth.interface';

class AuthService {
  private _auth0Client = new Auth0Client();

  public async getUsersByIds(userIds: string[]): Promise<Map<string, UserDto>> {
    if (!userIds.length) {
      return new Map<string, UserDto>();
    }

    const users = await this._auth0Client.getUsers({
      q: `user_id:(${userIds.join(' OR ')})`,
    });

    return Auth0Mapper.mapUserListToUserDto(users);
  }

  public async getClaims(req: Request) {
    const token = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    if (!token) {
      return null;
    }

    const claims = (await decode(token)) as DataStoredInToken;

    return {
      tokenSubject: claims.sub,
    };
  }
}

export default AuthService;
