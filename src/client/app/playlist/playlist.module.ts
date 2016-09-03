import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlayListPositionCopierModule } from '../shared/playlist/playlist-position-copier.module';
import { EditButtonModule } from '../shared/modus/edit-btn.module';
import { EliminateTheModule } from '../shared/pipes/eliminate-the.module';
import { TunePlayedModule } from '../shared/tune/tune-played.module';

import { PlaylistComponent } from './playlist.component';
import { PlayListItemComponent } from './item/playlist-item.component';
import { PlayListItemSetPositionComponent } from './item/set-position/playlist-item-set-position.component';
import { PlayListMenuComponent } from './menu/playlist-menu.component';


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
    PlaylistComponent,
    PlayListItemComponent,
    PlayListItemSetPositionComponent,
    PlayListMenuComponent
  ],
  exports: [
    PlaylistComponent
  ]
})
export class PlaylistModule { }
