import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlayListPositionCopierModule } from '../shared/playlist/playlist-position-copier.module';
import { EditButtonModule } from '../shared/modus/edit-btn.module';
import { EliminateTheModule } from '../shared/pipes/eliminate-the.module';
import { TunePlayedModule } from '../shared/tune/tune-played.module';

import { PlaylistPositionComponent } from './playlist-position.component';
import { PlayListPositionSetComponent } from './set/playlist-position-set.component';
import { PlayListPositionSetPositionComponent } from './set/position/playlist-position-set-position.component';
import { PlayInfoComponent } from './set/position/play-info/play-info.component';
import { PartPlayInfoListComponent } from './set/position/play-info/part-play-info-list/part-play-info-list.component';
import { PartPlayInfoListItemComponent } from './set/position/play-info/part-play-info-list/item/part-play-info-list-item.component';
import { PlaylistTuneDotsComponent } from './set/position/tune-dots/playlist-tune-dots.component';
import { PlayListPositionMenuComponent } from './menu/playlist-position-menu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditButtonModule,
    PlayListPositionCopierModule,
    EliminateTheModule,
    TunePlayedModule
  ],
  declarations: [
    PlaylistPositionComponent,
    PlayListPositionSetComponent,
    PlayListPositionSetPositionComponent,
    PlayInfoComponent,
    PartPlayInfoListComponent,
    PartPlayInfoListItemComponent,
    PlaylistTuneDotsComponent,
    PlayListPositionMenuComponent
  ],
  exports: [
    PlaylistPositionComponent
  ]
})
export class PlaylistPositionModule { }
