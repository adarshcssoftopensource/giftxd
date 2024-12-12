import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class TimezoneService {
  getAllTimezones(): string[] {
    return moment.tz.names();
  }
}
