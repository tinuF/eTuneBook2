/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, LifecycleEvent} from 'angular2/angular2';
import {RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
  selector: 'tune-title',
  lifecycle: [LifecycleEvent.onCheck]
})
@View({
  templateUrl: './components/tune-title-ui/tune-title-ui.html?v=<%= VERSION %>',
  styleUrls: ['./components/tune-title-ui/tune-title-ui.css?v=<%= VERSION %>'],
  pipes: [EliminateThe]
})
export class TuneTitleUI {
  tune: Tune;
  tuneTitle:string;
  path:string;
  
  constructor(public tuneBookService: TuneBookService, public location:Location){
    //not supported yet: one route and two components which are not tightly coupled.
    //this.tune = this.tuneBookService.getTune(routeParams.get('id'));
    this.setTuneTitle();
  }
  
  
  onCheck(){
    this.setTuneTitle();
  }
  
  setTuneTitle(){
    this.path= this.location.path();
    this.tuneTitle = "";
    
    if (this.path.indexOf('/tunes/', 0) >= 0) {
      this.tune = this.tuneBookService.getCurrentTune();
      if (this.tune != null) {
        this.tuneTitle = this.tune.title;
      }
    }
  }
}
