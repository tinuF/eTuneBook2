import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EliminateThePipe } from './eliminate-the.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [EliminateThePipe],
  exports: [EliminateThePipe]
})
export class EliminateTheModule { }
