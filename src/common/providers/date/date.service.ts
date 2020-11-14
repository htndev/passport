import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  MILLISECONDS = 1000;

  timestampToDate = (timestamp: number): Date => new Date(this.secondsToMilliseconds(timestamp));

  private secondsToMilliseconds(seconds: number): number {
    return seconds * this.MILLISECONDS;
  }
}
