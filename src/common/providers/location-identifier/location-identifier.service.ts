import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { retry } from 'rxjs/operators';

import { LocationInfo } from '../../utils/types';

enum LocationServiceResponseStatuses {
  SUCCESS = 'success',
  FAIL = 'fail'
}

interface IpAPIResponse {
  status: LocationServiceResponseStatuses;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: number;
  isp: string;
  org: string;
  as: string;
  query: string;
}

@Injectable()
export class LocationIdentifierService {
  private readonly url = 'http://ip-api.com/json';

  constructor(private readonly httpService: HttpService) {}

  async getInfo(ip: string): Promise<LocationInfo> {
    const { data: ipInfo } = await this.httpService
      .get<Readonly<IpAPIResponse>>(this.getUrl(ip))
      .pipe(retry(5))
      .toPromise();
    if (ipInfo.status === LocationServiceResponseStatuses.FAIL) {
      throw new BadRequestException(`Cannot parse an IP address '${ip}'. Probably, it's over the range`);
    }
    return this.map(ipInfo);
  }

  private getUrl(ip: string): string {
    return `${this.url}/${ip}`;
  }

  private map = ({ countryCode: code, country, regionName: region, city }: IpAPIResponse): LocationInfo => ({
    country,
    code,
    region,
    city
  });
}
