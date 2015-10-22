/// <reference path="../../typings.d.ts" />
import {Component, View, DoCheck} from 'angular2/angular2';
import {RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';


@Component({
  selector: 'page-title'
})
@View({
  templateUrl: './components/page-title/page-title.html',
  styleUrls: ['./components/page-title/page-title.css']
})
export class PageTitleUI implements DoCheck {
  pageTitle:string;
  path:string;
  
  constructor(public tuneBookService: TuneBookService, public location:Location){
    this.setPageTitle();
  }
  
  
  doCheck(){
    this.setPageTitle();
  }
  
  setPageTitle(){
    this.path= this.location.path();
    this.pageTitle = "";
    
    if (this.path.indexOf('/abc', 0) >= 0) {
      this.pageTitle = "Abc"
    } else if (this.path.indexOf('/tunes/', 0) >= 0) {
      this.pageTitle = "Dots"  
    } else if (this.path.indexOf('/tunes', 0) >= 0) {
      this.pageTitle = "Tunes"
    } else if (this.path.indexOf('/filter', 0) >= 0) {
      this.pageTitle = "Filter"
    }
  }
}
