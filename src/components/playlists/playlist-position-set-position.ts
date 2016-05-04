import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlaylistTuneUI} from '../../components/playlists/playlist-tune';
import {TunePlayedUI} from '../common/tune-played';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/playlists/playlist-position-set-position-play-info';



@Component({
    selector: 'etb-playlist-position-set-position',
    templateUrl: './components/playlists/playlist-position-set-position.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedUI, PlaylistTuneUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/playlists/playlist-position-set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    @ViewChild('inputTuneSetPositionPlayInfoRepeat') inputTuneSetPositionPlayInfoRepeat: ElementRef;
    playInfoAnnotationShown: boolean;
    editModus: boolean;
    editModusSubscription: any;

    constructor(public tuneBookService: TuneBookService, public router: Router, public renderer: Renderer) {

    }

    ngOnInit() {
        this.playInfoAnnotationShown = false;
        this.editModusSubscription = this.tuneBookService.editModusChange$.subscribe(
            editModus => this.editModus = editModus);
    }
    
    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
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

    togglePlayInfoAnnotation() {
        this.playInfoAnnotationShown = !this.playInfoAnnotationShown;
    }

    addPartPlayInfo() {
        this.tuneSetPositionPlayInfo.addPartPlayInfo(new PartPlayInfo("", ""));
        this.tuneBookService.storeTuneBookAbc();
    }
}


