import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {InfoMenuUI} from '../../components/info-menu/info-menu';


@Component({
    selector: 'etb-home',
    templateUrl: './components/home/home.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuUI],
    styleUrls: ['./components/home/home.css']
})
export class Home {
    constructor() {

    }
}
