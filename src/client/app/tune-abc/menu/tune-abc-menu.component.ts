import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-abc-menu',
    templateUrl: 'tune-abc-menu.component.html',
    styleUrls: ['tune-abc-menu.component.css']
})
export class TuneAbcMenuComponent implements OnInit {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    deleteTune() {
        // Delete all TuneSetPositions with that tune
        this.tuneBookService.deleteTune(this.tune.id);
        this.router.navigate(['/Tunes']);

        // Put TuneBook to localStorage
        this.tuneBookService.storeTuneBookAbc();
    }

    tuneUp() {
        // Transpose up
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.transposeDown.next(null);
    }
}

