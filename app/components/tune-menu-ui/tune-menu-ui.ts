/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams, Location, OnActivate, OnReuse} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {TuneAbcUI} from '../tune-abc-ui/tune-abc-ui';
import {TuneDotsUI} from '../tune-dots-ui/tune-dots-ui';
import {FromNow} from '../../pipes/from-now';


@Component({
  selector: 'tune-menu',
   properties: ['tune: tune']
})
@View({
  templateUrl: './components/tune-menu-ui/tune-menu-ui.html',
  styleUrls: ['./components/tune-menu-ui/tune-menu-ui.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: [FromNow]
})
export class TuneMenuUI  {
  tune: Tune;
 
  constructor(public tuneBookService: TuneBookService, public router: Router, public location:Location) {

  }
}

