//import { PlaylistListComponent } from './playlist-list.component';

export const PlaylistListRoutes = [
  //{ path: '/playlists', component: PlaylistListComponent, terminal: true }
  //lazy loading
  {
    path: 'playlists',
    component: '../app/+playlist-list/playlist-list.component#PlaylistListComponent',
    terminal: true
  }
];
