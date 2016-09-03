import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookComponent } from './book.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [BookComponent],
  exports: [BookComponent]
})
export class BookModule { }
