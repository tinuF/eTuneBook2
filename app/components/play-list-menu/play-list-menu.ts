import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';
import {FilterSettings} from '../../common/settings/filter-settings';


@Component({
  selector: 'etb-play-list-menu',
  inputs: ['sets'],
  templateUrl: './components/play-list-menu/play-list-menu.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['./components/play-list-menu/play-list-menu.css'],
})
export class PlayListMenuUI implements OnInit {
  sets: Array<TuneSet>;
  sorting: string;
  filterSettings: FilterSettings;
 
  constructor(public tuneBookService: TuneBookService) {
    this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
  }
  
  ngOnInit(){
    
  }
  
  sortPlaydate(e){
    
    if (this.sorting != "playdateAsc") {
      //sort tuneSet playdate ascending  
      this.sets.sort(function(a:TuneSet, b:TuneSet) {
        return a.getLastPlayDate() - b.getLastPlayDate()
      })
      this.sorting = "playdateAsc";
      
    } else if (this.sorting != "playdateDesc") {
      //sort tuneSet playdate descending  
      this.sets.sort(function(a:TuneSet, b:TuneSet) {
        return b.getLastPlayDate() - a.getLastPlayDate()
      })
      this.sorting = "playdateDesc";
    }
    
  }
  
  sortRandom(e){
    this.sets = this.tuneBookService.shuffleTuneSetList();
    this.sorting = "random";
  }
  
  filterSets(e){
    this.filterSettings.toggleSetIdFilter();
    this.tuneBookService.applyFilter();  
  }
}


