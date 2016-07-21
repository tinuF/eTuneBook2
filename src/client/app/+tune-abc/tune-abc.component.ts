import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune } from '../business/index';
import { TunePlayedComponent } from '../shared/tune/index';
import { TuneAbcMenuComponent } from './menu/tune-abc-menu.component';
import { TuneAbcEditorComponent } from './editor/tune-abc-editor.component';

@Component({
    moduleId: module.id,
    selector: 'tune-abc',
    templateUrl: 'tune-abc.component.html',
    styleUrls: ['tune-abc.component.css'],
    directives: [TuneAbcMenuComponent, TunePlayedComponent, TuneAbcEditorComponent]
})
export class TuneAbcComponent implements OnInit, OnDestroy {
    tune: Tune;
    abcEditor: string;
    routerSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public route: ActivatedRoute) {
        //console.log('tune-abc:constructor called');
    }

    ngOnInit() {
        this.routerSubscription = this.route
            .params
            .subscribe(params => {
                let id = +params['id'];
                this.tune = this.tuneBookService.getTune(id);
            });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        //console.log('tune-abc:ngOnDestroy called:');
    }
}
