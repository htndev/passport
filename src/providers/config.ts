import {Injectable} from '@nestjs/common';

@Injectable()
export class Config {
  constructor(private readonly config: any) {
    
  }
}