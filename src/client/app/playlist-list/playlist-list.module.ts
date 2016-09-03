import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SpinnerModule } from '../shared/spinner/spinner.module';

import { PlaylistListComponent } from './playlist-list.component';
import { PlaylistListItemComponent } from './item/playlist-list-item.component';
import { PlaylistListMenuComponent } from './menu/playlist-list-menu.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule
  ],
  declarations: [
    PlaylistListComponent,
    PlaylistListItemComponent,
    PlaylistListMenuComponent
  ],
  exports: [
    PlaylistListComponent,
  ]
})
export class PlaylistListModule { }
