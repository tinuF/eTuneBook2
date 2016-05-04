import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
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
export class PlayListItemSetPositionUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    editModusSubscription: any;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModusSubscription = this.tuneBookService.editModusChange$.subscribe(
            editModus => this.editModus = editModus);
    }
    
    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
    }
}


