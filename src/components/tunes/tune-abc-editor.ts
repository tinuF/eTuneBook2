import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {Router} from 'angular2/router';
import * as jQuery from 'jquery';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';

import {TuneMenuUI} from '../tunes/tune-menu';
import {TuneDotsUI} from '../tunes/tune-dots';
import {TunePlayedUI} from '../common/tune-played';



@Component({
    selector: 'etb-tune-abc-editor',
    templateUrl: './components/tunes/tune-abc-editor.html',
    styleUrls: ['./components/tunes/tune-abc-editor.css'],
    directives: [TuneMenuUI, TuneDotsUI, TunePlayedUI]
})
export class TuneAbcEditorUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    abcEditor: any;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.initABCJSEditor();
    }

    ngDoCheck() {
        //$(".title.meta-top").css("fill", "red");
        //Chords
        jQuery(".chord").css("font-size", "0.7em");
        //Fingering
        jQuery("text.annotation").css("font-size", "0.6em");
        //$(".meta-bottom").css("display", "none");
        jQuery(".meta-bottom").css("font-size", "0.7em");
    }

    initABCJSEditor() {
        setTimeout(() => {
            var editHere = 'abcEditorFor' + this.tune.intTuneId;
            var showHere = 'DotsForTune' + this.tune.intTuneId;

            let engraverParams = {
                scale: 1.0,

                staffwidth: 640,
                /*
                paddingtop: 0,
                paddingbottom: 0,
                paddingright: 0,
                paddingleft: 0,
                */
                add_classes: true
            };

            this.abcEditor = new ABCJS.Editor(editHere, { canvas_id: showHere, render_options: engraverParams });

        }, 0);
    }

    doneEditing(event) {
        //Move Value of Textarea to View-Model
        this.tune.pure = event.target.value;

        if (!this.tune.pure) {
            // Delete all TuneSetPositions with that tune
            this.tuneBookService.deleteTune(this.tune.intTuneId);
            this.router.navigate(["/Tunelist"]);

        } else {
            // Sync Tune-Fields
            this.tune.title = this.tuneBookService.getTuneTitle(this.tune);
            this.tune.type = this.tuneBookService.getTuneType(this.tune);
            this.tune.key = this.tuneBookService.getTuneKey(this.tune);
            this.tune.intTuneId = this.tuneBookService.getTuneId(this.tune);
        }

        // Put TuneBook to localStorage
        this.tuneBookService.storeTuneBookAbc();
    };

    renderAbc() {
        this.initABCJSEditor();
        //TODO: Re-Use would be better, but does not work
        //this.abcEditor.parseABC();
    }
}