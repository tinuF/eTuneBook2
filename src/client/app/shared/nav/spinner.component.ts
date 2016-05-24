import { Component, Input, OnDestroy } from '@angular/core';

//https://manuel-rauber.com/2016/01/05/angular-2-spinner-component/

@Component({
    moduleId: module.id,
    selector: 'etb-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent implements OnDestroy {
    currentTimeout: any;
    isDelayedRunning: boolean = false;

    @Input() delay: number = 300;

    @Input()
    set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}