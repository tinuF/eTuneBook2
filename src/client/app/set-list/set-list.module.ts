import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SpinnerModule } from '../shared/spinner/spinner.module';
import { EditButtonModule } from '../shared/modus/edit-btn.module';
import { SetListItemModule } from '../shared/set/set-list-item.module';

import { SetListComponent } from './set-list.component';
import { SetListMenuComponent } from './menu/set-list-menu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SpinnerModule,
    EditButtonModule,
    SetListItemModule
  ],
  declarations: [
    SetListComponent,
    SetListMenuComponent
  ],
  exports: [
    SetListComponent
  ]
})
export class SetListModule { }