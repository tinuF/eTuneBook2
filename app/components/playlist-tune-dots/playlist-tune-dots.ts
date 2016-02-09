import {Component, DoCheck, Input, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';


@Component({
    selector: 'etb-playlist-tune-dots',
    templateUrl: './components/playlist-tune-dots/playlist-tune-dots.html',
    styleUrls: ['./components/playlist-tune-dots/playlist-tune-dots.css'],
})
export class PlaylistTuneDotsUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    tuneObjectArray: Array<any>;
    shown: boolean;
    buttonText: string;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams) {

    }

    ngOnInit() {
        this.shown = false;
        this.buttonText = '+';
    }

    togglePlaylistTuneDots() {
        if (!this.isRendered()) {
            this.renderAbc(this.tune);
            this.show();

        } else {
            if (!this.shown) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    show() {
        this.shown = true;
        this.buttonText = '-';
    }

    hide() {
        this.shown = false;
        this.buttonText = '+';
    }


    isRendered(): boolean {
        let rendered = false;
        if (this.tuneObjectArray != null && this.tuneObjectArray.length > 0) {
            rendered = true;
        }
        return rendered;
    }

    shouldBeShown() {
        return this.shown;
    }

    getButtonText() {
        return this.buttonText;
    }


    ngDoCheck() {
        $(".meta-top").css("display", "none");
        $(".meta-bottom").css("display", "none");
        //Chords
        $(".chord").css("font-size", "0.7em");
        //Fingering
        $("text.annotation").css("font-size", "0.6em");
    }

    renderAbc(tune) {
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


            this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams)
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