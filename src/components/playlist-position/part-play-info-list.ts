import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {PartPlayInfoListItemUI} from './part-play-info-list-item';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';

@Component({
    selector: 'etb-part-play-info-list',
    templateUrl: './components/playlist-position/part-play-info-list.html',
    directives: [ROUTER_DIRECTIVES, PartPlayInfoListItemUI],
    styleUrls: ['./components/playlist-position/part-play-info-list.css'],
    pipes: [EliminateThe, FromNow]
})
export class PartPlayInfoListUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("part-play-info-list:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    addPartPlayInfoBefore(partPlayInfo: PartPlayInfo) {
        this.tuneSetPositionPlayInfo.addPartPlayInfoBefore(new PartPlayInfo("", ""), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfoAfter(partPlayInfo: PartPlayInfo) {
        this.tuneSetPositionPlayInfo.addPartPlayInfoAfter(new PartPlayInfo("", ""), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }
    
    deletePartPlayInfo(partPlayInfo:PartPlayInfo) {
        this.tuneSetPositionPlayInfo.deletePartPlayInfo(partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }
}


