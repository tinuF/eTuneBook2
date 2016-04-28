import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'eliminateThe'
})
export class EliminateThe implements PipeTransform {
    transform(txt: string): string {
        let theSplits: Array<string> = [];
        
        if (txt != 'undefined' && txt != null) {
            theSplits = txt.split(",");
        }
        
        return theSplits[0];
    }
}