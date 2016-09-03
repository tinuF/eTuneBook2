import { Route } from '@angular/router';
import { PlaylistListComponent } from './playlist-list.component';

export const PlaylistListRoutes: Route[] = [
  {
    path: 'playlists',
    component: PlaylistListComponent
  }
];
