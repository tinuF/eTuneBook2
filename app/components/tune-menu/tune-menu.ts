import {Component, Input, OnInit} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EditButtonUI} from '../../components/edit-btn/edit-btn';


@Component({
    selector: 'etb-tune-menu',
    templateUrl: './components/tune-menu/tune-menu.html',
    directives: [EditButtonUI],
    styleUrls: ['./components/tune-menu/tune-menu.css'],
})
export class TuneMenuUI implements OnInit {
    @Input() tune: Tune;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }
}


