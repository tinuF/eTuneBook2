/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, LifecycleEvent} from 'angular2/angular2';
import {RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';


@Component({
  selector: 'page-title',
  lifecycle: [LifecycleEvent.onCheck]
})
@View({
  templateUrl: './components/page-title-ui/page-title-ui.html?v=<%= VERSION %>',
  styleUrls: ['./components/page-title-ui/page-title-ui.css?v=<%= VERSION %>']
})
export class PageTitleUI {
  pageTitle:string;
  path:string;
  
  constructor(public tuneBookService: TuneBookService, public location:Location){
    this.setPageTitle();
  }
  
  
  onCheck(){
    this.setPageTitle();
  }
  
  setPageTitle(){
    this.path= this.location.path();
    this.pageTitle = "";
    
    if (this.path.indexOf('/abc', 0) >= 0) {
      this.pageTitle = "Abc"
    } else if (this.path.indexOf('/tunes/', 0) >= 0) {
      this.pageTitle = "Tune"  
    } else if (this.path.indexOf('/tunes', 0) >= 0) {
      this.pageTitle = "Tunes"
    } else if (this.path.indexOf('/filter', 0) >= 0) {
      this.pageTitle = "Filter"
    }
  }
}
