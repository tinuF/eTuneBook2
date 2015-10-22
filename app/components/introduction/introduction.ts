/// <reference path="../../typings.d.ts" />
import {Component, View} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

@Component({
  selector: 'component-1'
})
@View({
  templateUrl: './components/introduction/introduction.html',
  directives: [RouterLink]
})
export class Introduction {}
