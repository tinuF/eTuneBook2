import {Pipe} from 'angular2/core';

@Pipe({
  name: 'fromNow'
})
export class FromNow {
  transform(date:Date): string {
    var result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
}