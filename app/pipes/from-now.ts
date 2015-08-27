
/// <reference path="../typings/_custom.d.ts" />

import {Pipe} from 'angular2/angular2';

@Pipe({
  name: 'fromNow'
})
export class FromNow {
  transform(date): string {
    var result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
}