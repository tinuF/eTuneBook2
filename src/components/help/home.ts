import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {InfoMenuUI} from '../../components/help/info-menu';


@Component({
    selector: 'etb-home',
    templateUrl: './components/help/home.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuUI],
    styleUrls: ['./components/help/home.css']
})
export class Home {
    constructor() {

    }
}
