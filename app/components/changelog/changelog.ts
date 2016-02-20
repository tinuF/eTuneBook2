import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {InfoMenuUI} from '../../components/info-menu/info-menu';


@Component({
    selector: 'etb-changelog',
    templateUrl: './components/changelog/changelog.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuUI],
    styleUrls: ['./components/changelog/changelog.css']
})
export class ChangeLog {
    constructor() {

    }
}
