//import { PlaylistComponent } from './playlist.component';

export const PlaylistRoutes = [
  //{ path: '/playlist/:id', component: PlaylistComponent, terminal: true }
  //lazy loading
  {
    path: '/playlist/:id',
    component: '../app/+playlist/playlist.component#PlaylistComponent',
    terminal: true
  }
];
