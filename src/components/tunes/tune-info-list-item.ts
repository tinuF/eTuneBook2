import {Component, OnInit, DoCheck, Input} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Website} from '../../business/model/website';
import {Tune} from '../../business/model/tune';


@Component({
    selector: 'tune-info-list-item',
    templateUrl: './components/tunes/tune-info-list-item.html',
    styleUrls: ['./components/tunes/tune-info-list-item.css']
})
export class TuneInfoListItemUI implements OnInit, DoCheck {
    @Input() website: Website;
    @Input() tune: Tune;
    videoUrl: string;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    handleKeyDownOnWebsiteUrl(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnWebsiteUrl(event);
        }
    }

    handleBlurOnWebsiteUrl(event) {
        this.website.url = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteInfo() {
        this.tuneBookService.deleteWebsite(this.tune.intTuneId, this.website.url);
    }
}


