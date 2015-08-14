/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';

import {TuneBook} from '../../business/model/tunebook';


@Component({
  selector: 'tune-title-search'
})
@View({
  url: 'app/components/title-search/title-search.html?v=<%= VERSION %>'
})
export class TuneTitleSearch {
  
  constructor(public tuneBookService: TuneBookService) {
    
  }

  preventReload($event){
    
  }

  changeFilter($event){
    
    var query = $event.target.value.trim().toLowerCase();
    
  }

}