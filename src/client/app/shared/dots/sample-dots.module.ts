import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleDotsComponent } from './sample-dots.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SampleDotsComponent],
  exports: [SampleDotsComponent]
})
export class SampleDotsModule { }
