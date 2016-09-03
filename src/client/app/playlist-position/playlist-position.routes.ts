import { Route } from '@angular/router';
import { PlaylistPositionComponent } from './playlist-position.component';

export const PlaylistPositionRoutes: Route[] = [
  {
    path: 'playlist/:pl/position/:ps',
    component: PlaylistPositionComponent
  }
];
