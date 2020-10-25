import { LocationIdentifierService } from './location-identifier.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('location-identifier')
export class LocationIdentifierController {
  constructor(private readonly locationIdentifier: LocationIdentifierService) {}

  @Get()
  async getLocationInfo(@Query('ip') ip: string): Promise<any> {
    return await this.locationIdentifier.getInfo(ip);
  }
}
