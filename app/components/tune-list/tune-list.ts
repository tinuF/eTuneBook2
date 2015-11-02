/// <reference path="../../typings.d.ts" />
import {Component, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tune-list-item/tune-list-item';
import {TuneListMenuUI} from '../../components/tune-list-menu/tune-list-menu';


@Component({
  selector: 'etb-tune-list',
  templateUrl: './components/tune-list/tune-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, TuneListItemUI, TuneListMenuUI],
  styleUrls: ['./components/tune-list/tune-list.css'],
})
export class TuneListUI implements DoCheck {
  tunes: Array<Tune>;
 
  constructor(public tuneBookService: TuneBookService) {
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
  
  doCheck(){
    //todo: this does not work properly with text-search (might be called to often?)
    //with filter it works fine
    //example: text-search 'derry' among slip-jigs gives Dever the Dancer, Humours of Derrycrossane, Slide from Grace
    //(mixture-search 'de' and 'derry')
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
}


