import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TunePlayedUI} from '../common/tune/tune-played';

@Component({
    selector: 'etb-playlist-item-set-position',
    templateUrl: './components/playlist/playlist-item-set-position.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedUI],
    styleUrls: ['./components/playlist/playlist-item-set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListItemSetPositionUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist-item-set-position:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }
}

