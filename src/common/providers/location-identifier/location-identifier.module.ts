import { HttpModule, Module } from '@nestjs/common';
import { LocationIdentifierService } from './location-identifier.service';

@Module({
  imports: [HttpModule],
  exports: [LocationIdentifierService],
  providers: [LocationIdentifierService]
})
export class LocationIdentifierModule {}
