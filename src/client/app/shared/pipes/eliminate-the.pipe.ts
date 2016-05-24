import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'eliminateThe'
})
export class EliminateThePipe implements PipeTransform {
    transform(txt: string): string {
        let theSplits: Array<string> = [];

        if (txt != 'undefined' && txt != null) {
            theSplits = txt.split(",");
        }

        return theSplits[0];
    }
}