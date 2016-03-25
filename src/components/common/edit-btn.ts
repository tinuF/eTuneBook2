import {Component, OnInit} from 'angular2/core';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
    selector: 'etb-edit-btn',
    templateUrl: './components/common/edit-btn.html',
    styleUrls: ['./components/common/edit-btn.css'],
})
export class EditButtonUI implements OnInit {
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    toggleEditModus() {
        this.editModus = this.tuneBookService.toggleEditModus();
    }
}


