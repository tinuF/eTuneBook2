import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EditButtonModule } from '../shared/modus/edit-btn.module';
import { SetListItemModule } from '../shared/set/set-list-item.module';
import { TunePlayedModule } from '../shared/tune/tune-played.module';
import { TuneColorizerModule } from '../shared/tune/tune-colorizer.module';
import { TuneTransposerModule } from '../shared/tune/tune-transposer.module';
import { DialogModule } from '../shared/dialog/dialog.module';

import { TuneComponent } from './tune.component';
import { TuneDotsComponent } from './dots/tune-dots.component';
import { TuneDotsMenuComponent } from './dots/menu/tune-dots-menu.component';
import { TuneInfoListComponent } from './info-list/tune-info-list.component';
import { TuneInfoListItemComponent } from './info-list/item/tune-info-list-item.component';
import { TuneMenuComponent } from './menu/tune-menu.component';
import { TuneSetListComponent } from './set-list/tune-set-list.component';
import { TuneVideoListComponent } from './video-list/tune-video-list.component';
import { TuneVideoListItemComponent } from './video-list/item/tune-video-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    EditButtonModule,
    SetListItemModule,
    TunePlayedModule,
    TuneColorizerModule,
    TuneTransposerModule,
    DialogModule
  ],
  declarations: [
    TuneComponent,
    TuneDotsComponent,
    TuneDotsMenuComponent,
    TuneInfoListComponent,
    TuneInfoListItemComponent,
    TuneMenuComponent,
    TuneSetListComponent,
    TuneVideoListComponent,
    TuneVideoListItemComponent
  ],
  exports: [
    TuneComponent
  ]
})
export class TuneModule { }