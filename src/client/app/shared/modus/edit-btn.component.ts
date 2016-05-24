import { Component, OnInit } from '@angular/core';

import { TuneBookService } from '../../business//index';

@Component({
    moduleId: module.id,
    selector: 'etb-edit-btn',
    templateUrl: 'edit-btn.component.html',
    styleUrls: ['edit-btn.component.css'],
})
export class EditButtonComponent implements OnInit {
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


