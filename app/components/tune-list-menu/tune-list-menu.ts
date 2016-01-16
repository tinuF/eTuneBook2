import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';


@Component({
  selector: 'etb-tune-list-menu',
  templateUrl: './components/tune-list-menu/tune-list-menu.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['./components/tune-list-menu/tune-list-menu.css'],
})
export class TuneListMenuUI implements OnInit {
  tunes: Array<Tune>;
  sorting: string;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  ngOnInit(){
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
  
  sortTitle(e){
    
    if (this.sorting != "titleAsc") {
      //sort tune title ascending  
      this.tunes.sort(function(a: Tune, b: Tune) {
        let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase()

        if (titleA < titleB) {
          return -1
        }
        if (titleA > titleB) {
          return 1
        }
        return 0 //default return value (no sorting)
      });
      this.sorting = "titleAsc";
      
    } else if (this.sorting != "titleDesc") {
      //sort tune title descending  
      this.tunes.sort(function(a: Tune, b: Tune) {
        let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase()

        if (titleA < titleB) {
          return 1
        }
        if (titleA > titleB) {
          return -1
        }
        return 0 //default return value (no sorting)
      });
      this.sorting = "titleDesc";
    }
    
  }
  
  sortPlaydate(e){
    
    if (this.sorting != "playdateAsc") {
      //sort tune playdate ascending  
      this.tunes.sort(function(a:Tune, b:Tune) {
        return a.lastPlayed - b.lastPlayed
      })
      this.sorting = "playdateAsc";
      
    } else if (this.sorting != "playdateDesc") {
      //sort tune playdate descending  
      this.tunes.sort(function(a:Tune, b:Tune) {
        return b.lastPlayed - a.lastPlayed
      })
      this.sorting = "playdateDesc";
    }
    
  }
  
  sortRandom(e){
    this.tunes = this.tuneBookService.shuffleTuneList();
    this.sorting = "random";
  }
}


