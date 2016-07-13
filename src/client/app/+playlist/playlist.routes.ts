import { PlaylistComponent } from './playlist.component';

export const PlaylistRoutes = [
  {
    path: 'playlist/:id',
    //component: '../app/+playlist/playlist.component#PlaylistComponent',
    component: PlaylistComponent,
    terminal: true
  }
];
