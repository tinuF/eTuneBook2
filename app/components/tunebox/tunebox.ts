/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {Tune} from '../../business/model/tune';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
  selector: 'tunebox',
  properties: ['tune: tune']
})
@View({
  templateUrl: './components/tunebox/tunebox.html?v=<%= VERSION %>',
})
export class TuneBoxView {
  tune: Tune;
  constructor(public tuneBookService: TuneBookService){
    //funktioniert!
    //this.showSampleDots();  
  }
  
  showSampleDots() {
    setTimeout(() => {
      var showHere = 'sampleDotsViewerForTune' + this.tune.intTuneId;
      var tuneAbc = this.tuneBookService.getSampleAbc(this.tune);
      var sampleDotsScale = 0.9;
      var sampleDotsStaffWidth = 960;

      ABCJS.renderAbc(showHere, tuneAbc, {}, { scale: sampleDotsScale, paddingtop: 0, paddingbottom: 0, staffwidth: sampleDotsStaffWidth }, {});
    }, 0);
  }
}