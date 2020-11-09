import { AuthScope } from './../common/constants';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { NewUserDto, UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    private readonly locationIdentifier: LocationIdentifierService,
    private readonly jwtService: JwtService
  ) {}

  async register({ ip, email, password, username }: NewUserDto): Promise<any> {
    const userWithEmail = await this.userRepository.findUserByEmail(email);

    if (userWithEmail) {
      throw new ConflictException(`User with email '${email}' already exists`);
    }

    const userWithUsername = await this.userRepository.findUserByUsername(username);

    if (userWithUsername) {
      throw new ConflictException(`User with username '${username}' already exists`);
    }

    const ipInfo = await this.locationIdentifier.getInfo(ip);

    const locationId = await this.locationRepository.getOrInsertLocation(ipInfo);

    const registered = await this.userRepository.signUp({
      email,
      username,
      countryCode: locationId,
      password
    });

    return registered;
  }

  async signIn(user: UserDto): Promise<{ accessToken: string }> {
    const userData = await this.userRepository.signIn(user);

    const payload = {
      ...userData,
      scope: this.setScopes(AuthScope.PASSPORT, AuthScope.MEDIA),
      authority: AuthScope.PASSPORT
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  private setScopes(...scopes: AuthScope[]): string {
    return scopes.join(',');
  }
}
