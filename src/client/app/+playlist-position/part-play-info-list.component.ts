import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, PartPlayInfo, ACTION } from '../business/index';
import { PartPlayInfoListItemComponent } from '../+playlist-position/index';

@Component({
    moduleId: module.id,
    selector: 'etb-part-play-info-list',
    templateUrl: 'part-play-info-list.component.html',
    directives: [PartPlayInfoListItemComponent],
    styleUrls: ['part-play-info-list.component.css']
})
export class PartPlayInfoListComponent implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('part-play-info-list:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    addPartPlayInfoBefore(partPlayInfo: PartPlayInfo) {
        this.tuneSetPositionPlayInfo.addPartPlayInfoBefore(new PartPlayInfo('', ''), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfoAfter(partPlayInfo: PartPlayInfo) {
        this.tuneSetPositionPlayInfo.addPartPlayInfoAfter(new PartPlayInfo('', ''), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }

    deletePartPlayInfo(partPlayInfo: PartPlayInfo) {
        this.tuneSetPositionPlayInfo.deletePartPlayInfo(partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }
}


