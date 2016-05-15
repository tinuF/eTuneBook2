import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlaylistTuneDotsUI} from '../../components/playlist-position/playlist-tune-dots';
import {TunePlayedUI} from '../common/tune/tune-played';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/playlist-position/playlist-position-set-position-play-info';



@Component({
    selector: 'etb-playlist-position-set-position',
    templateUrl: './components/playlist-position/playlist-position-set-position.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedUI, PlaylistTuneDotsUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/playlist-position/playlist-position-set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    @ViewChild('inputTuneSetPositionPlayInfoRepeat') inputTuneSetPositionPlayInfoRepeat: ElementRef;
    playInfoAnnotationShown: boolean;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public renderer: Renderer) {

    }

    ngOnInit() {
        this.playInfoAnnotationShown = false;
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist-position-set-position:actionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }


    handleKeyDownOnTuneSetPositionPlayInfoRepeat(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneSetPositionPlayInfoRepeat.nativeElement, 'blur', []);
        }
    }

    handleBlurOnTuneSetPositionPlayInfoRepeat(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }
}


