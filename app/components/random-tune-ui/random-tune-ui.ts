/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, DoCheck} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
  selector: 'random-tune' 
})
@View({
  templateUrl: './components/random-tune-ui/random-tune-ui.html',
  directives: [RouterLink],
})
export class RandomTuneUI implements DoCheck {
  randomTuneId :number;
   
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.randomTuneId = this.tuneBookService.getRandomIntTuneId(); 
  }
  
  doCheck(){
    this.randomTuneId = this.tuneBookService.getRandomIntTuneId();
    
    /* consumes too much
    let newTuneId = this.randomTuneId;  
    
    while (newTuneId == this.randomTuneId) {
      newTuneId = this.tuneBookService.getRandomIntTuneId();
    }
    
    this.randomTuneId = newTuneId;
    */ 
  }
}

