import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';

@Component({
    selector: 'etb-part-play-info-list-item',
    templateUrl: './components/playlist-position/part-play-info-list-item.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/playlist-position/part-play-info-list-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class PartPlayInfoListItemUI implements OnInit, OnDestroy {
    @Input() partPlayInfo: PartPlayInfo;
    @ViewChild('inputPart') inputPart: ElementRef;
    @ViewChild('inputPlayInfo') inputPlayInfo: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public renderer: Renderer) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("part-play-info-list:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    handleKeyDownOnPart(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'select', []);
        }
    }

    handleBlurOnPart(focusEvent:FocusEvent) {
        //Replace : and , with - (: and , are used as separators and thus are not allowed)
        this.partPlayInfo.part = this.partPlayInfo.part.replace(/[:,]/g,'-');
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPartPlayInfo(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'select', []);
        }
    }

    handleBlurOnPartPlayInfo(focusEvent:FocusEvent) {
        //Replace : and , with - (: and , are used as separators and thus are not allowed)
        this.partPlayInfo.playInfo = this.partPlayInfo.playInfo.replace(/[:,]/g,'-');
        this.tuneBookService.storeTuneBookAbc();
    }
}


