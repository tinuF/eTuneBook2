import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterComponent } from './filter.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [FilterComponent],
  exports: [FilterComponent]
})
export class FilterModule { }
