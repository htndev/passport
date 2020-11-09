import { AuthScope } from './../../common/constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SecurityConfig } from '../../common/providers/config/security.config';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private readonly securityConfig: SecurityConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: securityConfig.jwtTokenSecret
    });
  }

  async validate({ username, email, scope, authority }: JwtPayload): Promise<Pick<User, 'email' | 'username'>> {
    const user = await this.userRepository.findUserByEmailAndUsername({ username, email });

    const scopes = scope.split(',');
    console.log({ username, email, scopes, authority });

    if(!scopes.includes(AuthScope.PASSPORT)) {
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
