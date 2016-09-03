import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SpinnerModule } from '../shared/spinner/spinner.module';
import { TunePlayedModule } from '../shared/tune/tune-played.module';
import { SampleDotsModule } from '../shared/dots/sample-dots.module';
import { EliminateTheModule } from '../shared/pipes/eliminate-the.module';

import { TuneListComponent } from './tune-list.component';
import { TuneListItemComponent } from './item/tune-list-item.component';
import { TuneListMenuComponent } from './menu/tune-list-menu.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    TunePlayedModule,
    SampleDotsModule,
    EliminateTheModule
  ],
  declarations: [
    TuneListComponent,
    TuneListItemComponent,
    TuneListMenuComponent
  ],
  exports: [
    TuneListComponent
  ]
})
export class TuneListModule { }