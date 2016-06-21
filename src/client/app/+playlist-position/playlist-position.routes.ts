//import { PlaylistPositionComponent } from './playlist-position.component';

export const PlaylistPositionRoutes = [
  //{ path: '/playlist/:pl/position/:ps', component: PlaylistPositionComponent, terminal: true }
  //lazy loading
  {
    path: '/playlist/:pl/position/:ps',
    component: '../app/+playlist-position/playlist-position.component#PlaylistPositionComponent',
    terminal: true
  }
];
