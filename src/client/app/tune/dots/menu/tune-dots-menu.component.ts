import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { TuneBookService, Tune } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-dots-menu',
    templateUrl: 'tune-dots-menu.component.html',
    styleUrls: ['tune-dots-menu.component.css']
})
export class TuneDotsMenuComponent {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    deleteTune() {
        this.tuneBookService.deleteTune(this.tune.id);
        this.router.navigate(['/Tunelist']);
    }

    tuneUp() {
        // Transpose up
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.transposeDown.next(null);
    }

    newSet() {
        this.tuneBookService.addTuneSet(this.tune.id);
    }

    newVideo() {
        this.tuneBookService.addVideo(this.tune.id, 'ytube', '', '0:00: ' + this.tune.title);
    }

    newWebsite() {
        this.tuneBookService.addWebsite(this.tune.id, '');
    }
}

