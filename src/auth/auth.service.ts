import { LocationRepository } from '../repositories/location.repository';
import { NewUserDto, UserDto } from './dto/user.dto';
import { LocationIdentifierService } from './../location-identifier/location-identifier.service';
import { UserRepository } from '../repositories/user.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    private readonly locationIdentifier: LocationIdentifierService
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

  async signIn(user: UserDto): Promise<any> {
    return this.userRepository.signIn(user);
  }
}
