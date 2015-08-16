/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, EventEmitter, LifecycleEvent} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';

import {TuneBook} from '../../business/model/tunebook';


@Component({
  selector: 'search',
  events: ['searchChange'],
  lifecycle: [LifecycleEvent.onChange] 
})
@View({
  url: 'app/components/search/search.html?v=<%= VERSION %>'
})
export class Search {
  searchChange: EventEmitter = new EventEmitter();
  
  constructor(public tuneBookService: TuneBookService) {
    
  }

  preventReload($event){
    
  }

  onChange($event){
    
    var search = $event.target.value.trim().toLowerCase();
    
    this.searchChange.next({
      value: search
    });
    
  }

}