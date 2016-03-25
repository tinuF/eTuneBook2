import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TunePlayedUI} from '../common/tune-played';

@Component({
    selector: 'etb-playlist-item-set-position',
    templateUrl: './components/playlists/playlist-item-set-position.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedUI],
    styleUrls: ['./components/playlists/playlist-item-set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListItemSetPositionUI implements OnInit {
    @Input() tuneSetPosition: TuneSetPosition;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }
}


