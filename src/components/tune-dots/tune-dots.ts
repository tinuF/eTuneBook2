import {Component, OnInit, DoCheck, Input} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import * as jQuery from 'jquery';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneDotsMenuUI} from '../tune-dots-menu/tune-dots-menu';


@Component({
    selector: 'etb-tune-dots',
    directives: [TuneDotsMenuUI],
    templateUrl: './components/tune-dots/tune-dots.html',
    styleUrls: ['./components/tune-dots/tune-dots.css']
})
export class TuneDotsUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    tuneObjectArray: Array<any>;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams) {


    }

    ngOnInit() {
        this.renderAbc();
        this.editModus = this.tuneBookService.isEditModus();
    }


    ngDoCheck() {
        //$(".title.meta-top").css("fill", "red");
        //Chords
        jQuery(".chord").css("font-size", "0.7em");
        //Fingering
        jQuery("text.annotation").css("font-size", "0.6em");
        //$(".meta-bottom").css("display", "none");
        jQuery(".meta-bottom").css("font-size", "0.7em");
        this.editModus = this.tuneBookService.isEditModus();
    }


    renderAbc() {
        //Render Abc
        //Important: Has to be timed-out, otherwise fingerings won't show up
        //Compare with tbkTuneFocus: ABCJS.Editor also timed-out -> fingerings show up
        //Compare with tbkPopover: ABCJS.renderAbc is not timed-out -> fingerings dont' show (timeout in popover -> no popover is shown)
        setTimeout(() => {
            let output = 'DotsForTune' + this.tune.intTuneId;
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