import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {InfoMenuUI} from '../../components/help/info-menu';


@Component({
    selector: 'etb-changelog',
    templateUrl: './components/help/changelog.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuUI],
    styleUrls: ['./components/help/changelog.css']
})
export class ChangeLog {
    constructor() {

    }
}
