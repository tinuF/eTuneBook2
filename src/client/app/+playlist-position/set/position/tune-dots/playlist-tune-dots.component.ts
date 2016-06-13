import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import * as jQuery from 'jquery';
import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, Tune, ACTION } from '../../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-tune-dots',
    templateUrl: 'playlist-tune-dots.component.html',
    styleUrls: ['playlist-tune-dots.component.css']
})
export class PlaylistTuneDotsComponent implements OnInit, OnDestroy {
    @Input() tune: Tune;
    showDots: boolean;
    numberOfBars: string;
    numberOfBarsRendered: string;
    tuneObjectArray: Array<any>;
    shown: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {
    }

    ngOnInit() {
        this.toggleDots();

        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-tune-dots:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_SHOW_PLAYLIST_DOTS) {
                    this.toggleDots();
                } else if (action === ACTION.CHANGE_NUMBER_OF_BARS_OF_PLAYLIST_DOTS) {
                    this.changeNumberOfBars()
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    loadPlaylistSettings() {
        this.showDots = this.tuneBookService.getCurrentPlaylistSettings().isShowDots();
        this.numberOfBars = this.tuneBookService.getCurrentPlaylistSettings().getNumberOfBars();
    }

    changeNumberOfBars() {
        this.loadPlaylistSettings();

        if (this.showDots) {
            this.showUponBarChange();
        } else {
            this.hide();
        }
    }

    toggleDots() {
        this.loadPlaylistSettings();

        if (this.showDots) {
            this.show();
        } else {
            this.hide();
        }
    }

    showUponBarChange() {
        this.renderAbc();
        this.shown = true;
    }

    show() {
        if (!this.isRendered() || this.numberOfBars !== this.numberOfBarsRendered) {
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

    renderAbc() {
        this.numberOfBarsRendered = this.numberOfBars;
        setTimeout(() => {
            let abc: string;
            if (this.numberOfBars == '*') {
                abc = this.tune.pure;
            } else {
                abc = this.tuneBookService.getSampleAbc(this.tune.id, 1, parseInt(this.numberOfBars));
            }
            let output = 'DotsForTune' + this.tune.id;
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



            this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams);

            jQuery('.meta-top').css('display', 'none');
            jQuery('.meta-bottom').css('display', 'none');
            //Chords
            jQuery('.chord').css('font-size', '0.7em');
            //Fingering
            jQuery('text.annotation').css('font-size', '0.6em');

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