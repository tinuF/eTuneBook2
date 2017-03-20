import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune, TuneSetPosition, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-position-tune',
    templateUrl: 'set-position-tune.component.html',
    styleUrls: ['set-position-tune.component.css'],
})
export class SetpositionTuneComponent implements OnInit, OnDestroy {
    @Input() tune: Tune;
    @Input() tuneSetPosition: TuneSetPosition;
    editModus: boolean;
    modusActionSubscription: Subscription;
    dragStart: boolean;
    dragOver: boolean;
    confirmDeleteTuneSetPosition: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.confirmDeleteTuneSetPosition = false;

        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('set-position-tune:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    justPlayedTheTune() {
        this.tuneBookService.addTunePlayDate(this.tune);
    }

    handleDragStart(dragEvent: DragEvent) {
        //console.log('DragStart: ' + this.tune.title);
        this.dragStart = true;
        dragEvent.dataTransfer.effectAllowed = 'move';
        let data: string = 'id:' + this.tuneSetPosition.tuneSetId + ',pos:' + this.tuneSetPosition.position;
        dragEvent.dataTransfer.setData('text/html', data);
    }

    handleDragOver(dragEvent: DragEvent) {
        //console.log('DragOver: ' + this.tune.title);

        if (dragEvent.preventDefault) {
            dragEvent.preventDefault();
        }

        dragEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(dragEvent: DragEvent) {
        //console.log('DragEnter: ' + this.tune.title);
        this.dragOver = true;
        //(<HTMLElement>dragEvent.target).classList.add('over');
    }

    handleDragLeave(dragEvent: DragEvent) {
        //console.log('DragLeave: ' + this.tune.title);
        this.dragOver = false;
        //(<HTMLElement>dragEvent.target).classList.remove('over');
    }

    handleDrop(dragEvent: DragEvent) {
        //console.log('Drop: ' + this.tune.title);
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

        this.dragOver = false;

        return false;
    }

    handleDragEnd(dragEvent: DragEvent) {
        //console.log('DragEnd: ' + this.tune.title);
        //(<HTMLElement>dragEvent.target).style.opacity = '1.0';
        this.dragStart = false;
        this.dragOver = false;
    }

    getSourceTuneSetId(data: string): number {
        let tuneSetId: string;
        let tuneSetIdSplits: Array<string> = [];

        tuneSetIdSplits = data.split('id:');

        if (tuneSetIdSplits.length > 1) {
            tuneSetIdSplits = tuneSetIdSplits[1].split(',');
            tuneSetId = tuneSetIdSplits[0].replace(/^\s+|\s+$/g, '');
        }

        return parseInt(tuneSetId);
    }

    getSourceTuneSetTunePosition(data: string): string {
        let tuneSetTunePosition: string;
        let tuneSetTunePositionSplits: Array<string> = [];

        tuneSetTunePositionSplits = data.split('pos:');

        if (tuneSetTunePositionSplits.length > 1) {
            tuneSetTunePositionSplits = tuneSetTunePositionSplits[1].split(',');
            tuneSetTunePosition = tuneSetTunePositionSplits[0].replace(/^\s+|\s+$/g, '');
        }
        return tuneSetTunePosition;
    }

    deleteTuneSetPosition() {
        this.tuneBookService.deleteTuneSetPosition(this.tuneSetPosition.tuneSetId, this.tuneSetPosition.position);
    }
}
