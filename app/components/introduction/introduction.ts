import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {InfoMenuUI} from '../../components/info-menu/info-menu';


@Component({
  selector: 'introduction',
  templateUrl: './components/introduction/introduction.html',
  directives: [ROUTER_DIRECTIVES, InfoMenuUI],
  styleUrls: ['./components/introduction/introduction.css']
})
export class Introduction {
  constructor() {
    
  }
}
