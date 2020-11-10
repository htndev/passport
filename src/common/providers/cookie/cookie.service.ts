import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  setCookie(response: Response, key: string, value: string | number): void {
    console.log(response.cookie);
    return;
  }

  getCookie(request: Request, key: string) {
    console.log(request.cookies);
    return;
  }
}
