/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {Tune} from '../../business/model/tune';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
  selector: 'sampledots',
  properties: ['tune: tune']
})
@View({
  templateUrl: './components/sample-dots/sample-dots.html?v=<%= VERSION %>',
})
export class SampleDots {
  tune: Tune;
  tuneObjectArray: Array<any>;
  shown:boolean;
  buttonText:string;
  
  constructor(public tuneBookService: TuneBookService){
    //funktioniert, frisst bei grossen Listen aber zu viel Leistung!
    //this.showSampleDots();  
    
    this.shown = false;
    this.buttonText = 'Show';
  }
  
  toggleSampleDots(){
    if (!this.isRendered()) {
      this.showSampleDots();
      this.show();
    
    } else {
      if (!this.shown) {
        this.show();
      } else {
        this.hide();
      }  
    }
  }
  
  show(){
    this.shown = true;
    this.buttonText = 'Hide'
  }
  
  hide(){
    this.shown = false;
    this.buttonText = 'Show'
  }
  
  showSampleDots() {
    setTimeout(() => {
      let output = 'sampleDotsForTune' + this.tune.intTuneId;
      let tunebookString = this.tuneBookService.getSampleAbc(this.tune.intTuneId, 1, 2);
      let parserParams = {};
      let engraverParams = {
        scale: 0.9,
        staffwidth: 120,
        paddingtop: 0, 
        paddingbottom: 0,
        paddingright: 0, 
        paddingleft: 0,
        editable: false,
        add_classes: true,
        listener: null
      };
      let renderParams = {
        startingTune: 0
      };

      
      this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams)
    }, 0);
  }
  
  isRendered():boolean{
    let rendered = false;
    if (this.tuneObjectArray != null && this.tuneObjectArray.length > 0) {
      rendered = true;
    }
    return rendered;
  }
  
  shouldBeShown(){
    return this.shown;
  }
  
  getButtonText(){
    return this.buttonText;
  }
}