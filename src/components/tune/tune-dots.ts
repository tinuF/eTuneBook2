import {Component, OnInit, OnDestroy, Input, ElementRef} from 'angular2/core';
import {Router} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';
import * as jQuery from 'jquery';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Tune} from '../../business/model/tune';
import {TuneDotsMenuUI} from '../tune/tune-dots-menu';


@Component({
    selector: 'etb-tune-dots',
    directives: [TuneDotsMenuUI],
    templateUrl: './components/tune/tune-dots.html',
    styleUrls: ['./components/tune/tune-dots.css']
})
export class TuneDotsUI implements OnInit, OnDestroy {
    @Input() tune: Tune;
    tuneObjectArray: Array<any>;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {


    }

    ngOnInit() {
        this.renderAbc();
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("tune-dots:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    renderAbc() {
        //Render Abc
        setTimeout(() => {
            let output = 'DotsForTune' + this.tune.id;
            let tunebookString = this.skipFingering(this.tune.pure);
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
                listener: null
            };
            let renderParams = {
            };


            this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams);

            //jQuery(".title.meta-top").css("fill", "red");
            jQuery(this.elementRef.nativeElement).find(".chord").css("font-size", "0.7em");
            //Fingering
            jQuery(this.elementRef.nativeElement).find("text.annotation").css("font-size", "0.6em");
            //jQuery(".meta-bottom").css("display", "none");
            jQuery(this.elementRef.nativeElement).find(".meta-bottom").css("font-size", "0.7em");

        }, 0);
    }

    skipFingering(tuneAbc) {
        //Todo: skipFingering
        /*
        if (!$scope.fingeringAbcIncl) {
            tuneAbc = tuneAbc.replace(eTBk.PATTERN_FINGER, '');
        }
        */
        return tuneAbc;
    }
}