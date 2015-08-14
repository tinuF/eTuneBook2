
/// <reference path="../typings/_custom.d.ts" />
import {Pipe, PipeFactory, NullPipeFactory} from 'angular2/angular2';

export function isDate(date: Date): boolean {
  return typeof date === 'object';
}

export class FromNow implements Pipe {

  supports(date: Date): boolean {
    return isDate(date);
  }
  
  transform(date): string {
    var result = "";

    if (date != null) {
      result = moment(date).fromNow();
    }

    return result;
  }
  
  onDestroy(): void {
    // not needed since this is stateless
  }

}

// We create a factory since we create an instance for each binding for stateful pipes
export class FromNowFactory implements PipeFactory {
  supports(date: Date): boolean {
    return isDate(date);
  }
  create(cdRef): Pipe {
    return new FromNow();
  }
}

// Since templates in angular are async we are passing the value to
// NullPipeFactory if the value is not supported
export var fromNow = [ new FromNowFactory(), new NullPipeFactory() ];