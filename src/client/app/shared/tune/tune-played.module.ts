import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MomentModule } from 'angular2-moment';

import { TunePlayedComponent } from './tune-played.component';

@NgModule({
  imports: [CommonModule, MomentModule],
  declarations: [TunePlayedComponent],
  exports: [TunePlayedComponent]
})
export class TunePlayedModule { }
