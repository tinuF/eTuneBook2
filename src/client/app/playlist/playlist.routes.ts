import { Route } from '@angular/router';
import { PlaylistComponent } from './playlist.component';

export const PlaylistRoutes: Route[] = [
  {
    path: 'playlist/:id',
    component: PlaylistComponent
  }
];
