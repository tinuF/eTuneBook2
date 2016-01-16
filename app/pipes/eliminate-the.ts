import {Pipe} from 'angular2/core';

@Pipe({
  name: 'eliminateThe'
})
export class EliminateThe {
  transform(txt):string {
    var theSplits = [];
    if (txt != 'undefined' && txt != null){
      theSplits = txt.split(",");
    }
		return theSplits[0];
  }
}