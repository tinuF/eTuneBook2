import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-sampledots',
    templateUrl: 'sample-dots.component.html',
    styleUrls: ['sample-dots.component.css']
})
export class SampleDotsComponent {
    @Input() tune: Tune;
    tuneObjectArray: Array<any>;
    shown: boolean;
    buttonText: string;

    constructor(public tuneBookService: TuneBookService) {
        //funktioniert, frisst bei grossen Listen aber zu viel Leistung!
        //this.toggleSampleDots();  

        this.shown = false;
        this.buttonText = '+';
    }

    toggleSampleDots() {
        if (!this.isRendered()) {
            this.showSampleDots();
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

    showSampleDots() {
        setTimeout(() => {
            let output = 'sampleDotsForTune' + this.tune.id;
            let tunebookString = this.tuneBookService.getSampleAbc(this.tune.id, 1, 2);
            let parserParams = {};
            let engraverParams = {
                scale: 1.0,
                staffwidth: 160,
                paddingtop: 0,
                paddingbottom: 0,
                paddingright: 0,
                paddingleft: 0,
                editable: false,
                add_classes: true,
                listener: <any>null
            };
            let renderParams = {
                startingTune: 0
            };


            this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams);
        }, 0);
    }

    isRendered(): boolean {
        let rendered = false;
        if (this.tuneObjectArray !== null && this.tuneObjectArray !== undefined && this.tuneObjectArray.length > 0) {
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
}
