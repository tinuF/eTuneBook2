import { Component, OnInit, OnChanges, OnDestroy, Input, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import * as jQuery from 'jquery';
//import * as ABCJS from 'abcjs';

import { TuneBookService, Tune, ACTION } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-dots',
    templateUrl: 'tune-dots.component.html',
    styleUrls: ['tune-dots.component.css']
})
export class TuneDotsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tune: Tune;
    tuneObjectArray: Array<any>;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public elementRef: ElementRef) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('tune-dots:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnChanges() {
        //ngOnChanges wird durchlaufen
        //-bei Instanzierung (vor ngOnInit)
        //-bei Wechsel des Tunes im Randomizer
        this.renderAbc();
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    renderAbc() {
        //Render Abc
        setTimeout(() => {
            let output = 'DotsForTune' + this.tune.id;
            let parserParams = {};
            let engraverParams = {
                scale: 1.0,
                /*
                staffwidth: 740,
                paddingtop: 0,
                paddingbottom: 0,
                paddingright: 0,
                paddingleft: 0,
                */
                editable: false,
                add_classes: true,
                listener: <any>null
            };
            let renderParams = {
            };


            this.tuneObjectArray = ABCJS.renderAbc(output, this.tune.pure, parserParams, engraverParams, renderParams);

            //jQuery('.title.meta-top').css('fill', 'red');
            jQuery(this.elementRef.nativeElement).find('.chord').css('font-size', '0.7em');
            //Fingering
            jQuery(this.elementRef.nativeElement).find('text.annotation').css('font-size', '0.6em');
            //jQuery('.meta-bottom').css('display', 'none');
            jQuery(this.elementRef.nativeElement).find('.meta-bottom').css('font-size', '0.7em');

            let midiOutput = 'MidiForTune' + this.tune.id;

            ABCJS.renderMidi(midiOutput, this.tune.pure, {}, { generateDownload: true }, {});
            jQuery(this.elementRef.nativeElement).find('.renderMIDI').find('a').addClass('btn')
            .addClass('btn-secondary').addClass('btn-sm').prop('title', 'download midi')
            .html('<i class="mdi mdi-download">midi</i>');


        }, 0);
    }
}
