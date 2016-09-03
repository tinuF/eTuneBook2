import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TimeAgoPipe} from 'angular2-moment';

import { TunePlayedComponent } from './tune-played.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TunePlayedComponent, TimeAgoPipe],
  exports: [TunePlayedComponent]
})
export class TunePlayedModule { }
