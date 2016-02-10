import {Component, DoCheck, Input, OnInit} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';

@Component({
    selector: 'etb-playlist-tune-dots',
    templateUrl: './components/playlist-tune-dots/playlist-tune-dots.html',
    styleUrls: ['./components/playlist-tune-dots/playlist-tune-dots.css'],
})
export class PlaylistTuneDotsUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    showDots: boolean;
    numberOfBars: string;
    tuneObjectArray: Array<any>;
    shown: boolean;

    constructor(public tuneBookService: TuneBookService) {
    }

    ngOnInit() {
        this.showDots = this.tuneBookService.getCurrentPlaylistSettings().isShowDots();
        this.numberOfBars = this.tuneBookService.getCurrentPlaylistSettings().getNumberOfBars();

        if (this.showDots) {
            this.show(this.numberOfBars);
        } else {
            this.hide();
        }
    }

    ngDoCheck() {
        this.showDots = this.tuneBookService.getCurrentPlaylistSettings().isShowDots();
        let previousNumberOfBars = this.numberOfBars;
        this.numberOfBars = this.tuneBookService.getCurrentPlaylistSettings().getNumberOfBars();

        if (this.showDots) {
            this.show(previousNumberOfBars);
        } else {
            this.hide();
        }

        jQuery(".meta-top").css("display", "none");
        jQuery(".meta-bottom").css("display", "none");
        //Chords
        jQuery(".chord").css("font-size", "0.7em");
        //Fingering
        jQuery("text.annotation").css("font-size", "0.6em");
    }

    show(previousNumberOfBars: string) {
        if (!this.isRendered() || this.numberOfBars != previousNumberOfBars) {
            this.renderAbc();
        }
        this.shown = true;
    }

    hide() {
        this.shown = false;
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

    renderAbc() {
        setTimeout(() => {
            let abc: string;
            if (this.numberOfBars == "*") {
                abc = this.tune.pure;
            } else {
                abc = this.tuneBookService.getSampleAbc(this.tune.intTuneId, 1, parseInt(this.numberOfBars);
            }
            let output = 'DotsForTune' + this.tune.intTuneId;
            let tunebookString = this.skipFingering(abc);
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