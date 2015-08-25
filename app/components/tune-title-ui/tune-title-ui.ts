/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';


@Component({
  selector: 'book-title'
})
@View({
  templateUrl: './components/tune-title-ui/tune-title-ui.html?v=<%= VERSION %>',
  styleUrls: ['./components/tune-title-ui/tune-title-ui.css?v=<%= VERSION %>']
})
export class TuneTitleUI {
  tune: Tune;
  
  constructor(public tuneBookService: TuneBookService){
    this.tune = this.tuneBookService.getCurrentTune();
  }
  
}
