import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlayListPositionCopierComponent } from './playlist-position-copier.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PlayListPositionCopierComponent],
  exports: [PlayListPositionCopierComponent]
})
export class PlayListPositionCopierModule { }
