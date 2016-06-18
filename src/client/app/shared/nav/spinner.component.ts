import { Component, Input } from '@angular/core';

//https://manuel-rauber.com/2016/01/05/angular-2-spinner-component/

@Component({
    moduleId: module.id,
    selector: 'etb-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent  {
    @Input() isRunning: boolean;

    constructor() {
         console.log('spinner:constructor called');
    }
}