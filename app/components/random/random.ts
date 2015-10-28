/// <reference path="../../typings.d.ts" />
import {Component, View, DoCheck} from 'angular2/angular2';
import {Router, RouterLink, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
  selector: 'random' 
})
@View({
  templateUrl: './components/random/random.html',
  directives: [RouterLink],
})
export class RandomUI  {
  randomTuneId :number;
   
  constructor(public tuneBookService: TuneBookService, public router: Router, public location: Location) {
     
  }
  
  onInit(){
    
  }
  
  randomize(e){
    let path= this.location.path();
    let target:string;
    let targetId:number;
    
    target = "/Tune";
    
    if (path.indexOf('/sets', 0) >= 0) {
      target = "/Set";
    }
    
    if (target == "/Tune") {
      targetId = this.tuneBookService.getRandomIntTuneId();  
    } else if (target == "/Set") {
      targetId = this.tuneBookService.getRandomTuneSetId();
      alert('need to implement set view first')
    }
    
    this.router.navigate([target, {id: targetId}]);
  }
}

