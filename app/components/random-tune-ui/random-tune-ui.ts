/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
  selector: 'random-tune'
})
@View({
  templateUrl: './components/random-tune-ui/random-tune-ui.html?v=<%= VERSION %>'
})
export class RandomTuneUI {
   
  constructor(public tuneBookService: TuneBookService, public router: Router) {
   
  }
  
  onCheck(){
    
  }
  

  loadRandomTune() {
    let intTuneId = this.tuneBookService.getRandomIntTuneId();
    let url = "/tunes/" + intTuneId;
    //broken in alpha.35
    this.router.navigate(url, false);
  }
}

