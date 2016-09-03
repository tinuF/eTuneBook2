import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SampleDotsModule } from '../dots/sample-dots.module';
import { TunePlayedModule } from '../tune/tune-played.module';
import { EliminateTheModule } from '../pipes/eliminate-the.module';

import { SetListItemComponent } from './set-list-item.component';
import { SetPlaylistListComponent } from './playlist-list/set-playlist-list.component';
import { SetPlaylistListItemComponent } from './playlist-list/set-playlist-list-item.component';
import { SetPositionComponent } from './position/set-position.component';
import { SetpositionTuneComponent } from './position/set-position-tune.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SampleDotsModule,
    TunePlayedModule,
    EliminateTheModule
  ],
  declarations: [
    SetListItemComponent,
    SetPlaylistListComponent,
    SetPlaylistListItemComponent,
    SetPositionComponent,
    SetpositionTuneComponent
  ],
  exports: [
    SetListItemComponent,
  ]
})
export class SetListItemModule { }
