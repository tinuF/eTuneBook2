import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TuneColorizerComponent } from './tune-colorizer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TuneColorizerComponent],
  exports: [TuneColorizerComponent]
})
export class TuneColorizerModule { }
