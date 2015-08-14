
/// <reference path="../typings/_custom.d.ts" />
import {Pipe, PipeFactory, NullPipeFactory} from 'angular2/angular2';

export function isString(txt): boolean {
  return typeof txt === 'string';
}

export class EliminateThe implements Pipe {

  supports(txt): boolean {
    return isString(txt);
  }
  
  transform(txt):string {
    var theSplits = [];
    if (txt != 'undefined' && txt != null){
      theSplits = txt.split(",");
    }
		return theSplits[0];
  }
  
  onDestroy(): void {
    // not needed since this is stateless
  }

}

// We create a factory since we create an instance for each binding for stateful pipes
export class EliminateTheFactory implements PipeFactory {
  supports(txt): boolean {
    return isString(txt);
  }
  create(cdRef): Pipe {
    return new EliminateThe();
  }
}

// Since templates in angular are async we are passing the value to
// NullPipeFactory if the value is not supported
export var eliminateThe = [ new EliminateTheFactory(), new NullPipeFactory() ];