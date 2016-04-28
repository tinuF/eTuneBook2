import {Pipe, PipeTransform} from 'angular2/core';
import * as moment from 'moment';

@Pipe({
  name: 'fromNow'
})
export class FromNow implements PipeTransform {
  transform(date: Date): string {
    let result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
}