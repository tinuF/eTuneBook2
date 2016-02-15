import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {InfoMenuUI} from '../../components/info-menu/info-menu';


@Component({
  selector: 'etb-info',
  templateUrl: './components/info/info.html',
  directives: [ROUTER_DIRECTIVES, InfoMenuUI],
  styleUrls: ['./components/info/info.css']
})
export class InfoUI {
  constructor() {
    
  }
}
