import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TuneTransposerComponent } from './tune-transposer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TuneTransposerComponent],
  exports: [TuneTransposerComponent]
})
export class TuneTransposerModule { }