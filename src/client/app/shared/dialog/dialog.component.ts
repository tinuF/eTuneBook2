import { Component, OnInit, Input, Output, OnChanges, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'etb-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
    /*
    animations: [
      trigger('dialog', [
        transition('void => *', [
          style({ transform: 'scale3d(.3, .3, .3)' }),
          animate(100)
        ]),
        transition('* => void', [
          animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
      ])
    ]
    */
})
export class DialogComponent implements OnInit {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() confirmed: EventEmitter<any> = new EventEmitter();
    @Output() cancelled: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    okClicked() {
        this.confirmed.emit(null);
        this.close();
    }

    cancelClicked() {
        this.cancelled.emit(null);
        this.close();
    }
}