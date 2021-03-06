import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as jQuery from 'jquery';

import { TuneBookService, Tune, ACTION } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-abc-editor',
    templateUrl: 'tune-abc-editor.component.html',
    styleUrls: ['tune-abc-editor.component.css']
})
export class TuneAbcEditorComponent implements OnInit {
    @Input() tune: Tune;
    abcEditor: any;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.initABCJSEditor();
    }

    initABCJSEditor() {
        setTimeout(() => {
            var editHere = 'abcEditorFor' + this.tune.id;
            var showHere = 'DotsForTune' + this.tune.id;

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

            //$('.title.meta-top').css('fill', 'red');
            //Chords
            jQuery('.chord').css('font-size', '0.7em');
            //Fingering
            jQuery('text.annotation').css('font-size', '0.6em');
            //$('.meta-bottom').css('display', 'none');
            jQuery('.meta-bottom').css('font-size', '0.7em');

        }, 0);
    }

    doneEditing(focusEvent: FocusEvent) {
        //Move Value of Textarea to View-Model
        this.tune.pure = (<any>focusEvent.target).value;

        if (!this.tune.pure) {
            // Delete all TuneSetPositions with that tune
            this.tuneBookService.deleteTune(this.tune.id);
            this.router.navigate(['/Tunelist']);

        } else {
            // Sync Tune-Fields

            //TODO: Move to Service
            this.tune.title = this.tuneBookService.getTuneTitle(this.tune);
            this.tune.type = this.tuneBookService.getTuneType(this.tune);
            this.tune.key = this.tuneBookService.getTuneKey(this.tune);

        }

        // Put TuneBook to localStorage
        this.tuneBookService.storeTuneBookAbcAndBroadCastAction(ACTION.EDIT_ABC);
    };

    renderAbc() {
        this.initABCJSEditor();
        //TODO: Re-Use would be better, but does not work
        //this.abcEditor.parseABC();
    }
}
