import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Microservice } from '../../common/constants';
import { SecurityConfig } from '../../common/providers/config/security.config';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    securityConfig: SecurityConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: securityConfig.jwtPassportTokenSecret
    });
  }

  async validate({ username, email, scope }: JwtPayload): Promise<Pick<User, 'email' | 'username'>> {
    const user = await this.userRepository.findUserByEmailAndUsername({ username, email });

    if (scope !== Microservice.PASSPORT) {
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
