import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/common/sample-dots';
import {TunePlayedUI} from '../common/tune-played';

@Component({
    selector: 'etb-set-position-tune',
    templateUrl: './components/sets/set-position-tune.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsUI, TunePlayedUI],
    styleUrls: ['./components/sets/set-position-tune.css'],
    pipes: [EliminateThe, FromNow]
})
export class SetpositionTuneUI implements OnInit, OnDestroy {
    @Input() tune: Tune;
    @Input() tuneSetPosition: TuneSetPosition;
    editModus: boolean;
    editModusSubscription: Subscription;
    dragStart: boolean;
    dragOver: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.editModusSubscription = this.tuneBookService.editModusObservable.subscribe(
            editModus => this.editModus = editModus);
    }

    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
    }

    justPlayedTheTune() {
        var now = new Date();
        this.tuneBookService.addTunePlayDate(this.tune, now);
        this.tuneBookService.storeTuneBookAbc();
    }

    handleDragStart(dragEvent: DragEvent) {
        console.log("DragStart: " + this.tune.title);
        this.dragStart = true;
        dragEvent.dataTransfer.effectAllowed = 'move';
        let data: string = "id:" + this.tuneSetPosition.tuneSetId + ",pos:" + this.tuneSetPosition.position;
        dragEvent.dataTransfer.setData('text/html', data);
    }

    handleDragOver(dragEvent: DragEvent) {
        console.log("DragOver: " + this.tune.title);

        if (dragEvent.preventDefault) {
            dragEvent.preventDefault();
        }

        dragEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(dragEvent: DragEvent) {
        console.log("DragEnter: " + this.tune.title);
        this.dragOver = true;
        //(<HTMLElement>dragEvent.target).classList.add('over');
    }

    handleDragLeave(dragEvent: DragEvent) {
        console.log("DragLeave: " + this.tune.title);
        this.dragOver = false;
        //(<HTMLElement>dragEvent.target).classList.remove('over');
    }

    handleDrop(dragEvent: DragEvent) {
        console.log("Drop: " + this.tune.title);
        if (dragEvent.stopPropagation) {
            dragEvent.stopPropagation();
        }

        let data: string = dragEvent.dataTransfer.getData('text/html');

        let sourceTuneSetId: number = this.getSourceTuneSetId(data);
        let sourcePosition: number = parseInt(this.getSourceTuneSetTunePosition(data));
        let targetTuneSetId: number = this.tuneSetPosition.tuneSetId;
        let targetPosition: number = this.tuneSetPosition.position;
        let moveOrCopy: string = 'move';

        if (dragEvent.shiftKey) {
            moveOrCopy = 'copy';
        }

        // update model. angular will then react upon the changed model and re-render both sets  
        this.tuneBookService.moveTuneSetPosition(sourceTuneSetId, sourcePosition, targetTuneSetId, targetPosition, 'before', moveOrCopy);
        this.tuneBookService.storeTuneBookAbc();

        this.dragOver = false;

        return false;
    }

    handleDragEnd(dragEvent: DragEvent) {
        console.log("DragEnd: " + this.tune.title);
        //(<HTMLElement>dragEvent.target).style.opacity = '1.0';
        this.dragStart = false;
        this.dragOver = false;
    }

    getSourceTuneSetId(data: string): number {
        let tuneSetId: string;
        let tuneSetIdSplits: Array<string> = [];

        tuneSetIdSplits = data.split("id:");

        if (tuneSetIdSplits.length > 1) {
            tuneSetIdSplits = tuneSetIdSplits[1].split(",");
            tuneSetId = tuneSetIdSplits[0].replace(/^\s+|\s+$/g, '');
        }

        return parseInt(tuneSetId);
    }

    getSourceTuneSetTunePosition(data: string): string {
        let tuneSetTunePosition: string;
        let tuneSetTunePositionSplits: Array<string> = [];

        tuneSetTunePositionSplits = data.split("pos:");

        if (tuneSetTunePositionSplits.length > 1) {
            tuneSetTunePositionSplits = tuneSetTunePositionSplits[1].split(",");
            tuneSetTunePosition = tuneSetTunePositionSplits[0].replace(/^\s+|\s+$/g, '');
        }
        return tuneSetTunePosition;
    }

    deleteTuneSetPosition(e) {
        this.tuneBookService.deleteTuneSetPosition(this.tuneSetPosition.tuneSetId, this.tuneSetPosition.position);
        this.tuneBookService.storeTuneBookAbc();
    }
}
