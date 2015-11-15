/// <reference path="../../typings.d.ts" />
import {Component} from 'angular2/angular2';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';


@Component({
  selector: 'etb-tune-played',
  inputs: ['tune'],
  templateUrl: './components/tune-played/tune-played.html',
  styleUrls: ['./components/tune-played/tune-played.css'],
  pipes: [FromNow]
})
export class TunePlayedUI {
  tune: Tune;
  
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  justPlayedTheTune() {
    var now = new Date();
    this.tuneBookService.addTunePlayDate(this.tune, now);
    this.tuneBookService.storeTuneBookAbc();
  }
}

