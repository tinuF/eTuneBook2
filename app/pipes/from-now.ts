import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'fromNow'
})
export class FromNow implements PipeTransform {
  transform(date:Date): string {
    var result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
}