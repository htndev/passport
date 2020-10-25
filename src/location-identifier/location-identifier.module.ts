import { HttpModule, Module } from '@nestjs/common';
import { LocationIdentifierController } from './location-identifier.controller';
import { LocationIdentifierService } from './location-identifier.service';

@Module({
  imports: [HttpModule],
  controllers: [LocationIdentifierController],
  providers: [LocationIdentifierService]
})
export class LocationIdentifierModule {}
