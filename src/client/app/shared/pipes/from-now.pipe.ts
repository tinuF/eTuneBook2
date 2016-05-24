import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {
  transform(date: Date): string {
    let result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
}