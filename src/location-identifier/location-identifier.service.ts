import { HttpService, Injectable } from '@nestjs/common';
import { retry } from 'rxjs/operators';
import { LocationInfo } from '../common/types';

interface IpAPIResponse {
  readonly status: 'success' | 'fail';
  readonly country: string;
  readonly countryCode: string;
  readonly region: string;
  readonly regionName: string;
  readonly city: string;
  readonly zip: string;
  readonly lat: number;
  readonly lon: number;
  readonly timezone: number;
  readonly isp: string;
  readonly org: string;
  readonly as: string;
  readonly query: string;
}

@Injectable()
export class LocationIdentifierService {
  private readonly url = 'http://ip-api.com/json';

  constructor(private readonly httpService: HttpService) {}

  async getInfo(ip: string): Promise<any> {
    const { data: ipInfo } = await this.httpService
      .get<IpAPIResponse>(this.getUrl(ip))
      .pipe(retry(5))
      .toPromise();
    return this.map(ipInfo);
  }

  private getUrl(ip: string): string {
    return `${this.url}/${ip}`;
  }

  private map = ({
    countryCode: code,
    country,
    regionName: region,
    city,
  }: IpAPIResponse): LocationInfo => ({
    country,
    code,
    region,
    city,
  });
}
