import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerModule } from '../shared/spinner/spinner.module';

import { AbcComponent } from './abc.component';

@NgModule({
  imports: [CommonModule, FormsModule, SpinnerModule],
  declarations: [AbcComponent],
  exports: [AbcComponent]
})
export class AbcModule { }
