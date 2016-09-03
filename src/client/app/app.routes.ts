import { Routes } from '@angular/router';

import { TuneListRoutes } from './tune-list/tune-list.routes';
import { TuneRoutes } from './tune/tune.routes';
import { TuneAbcRoutes } from './tune-abc/tune-abc.routes';
import { SetListRoutes } from './set-list/set-list.routes';
import { FilterRoutes } from './filter/filter.routes';
import { PlaylistListRoutes } from './playlist-list/playlist-list.routes';
import { PlaylistRoutes } from './playlist/playlist.routes';
import { PlaylistPositionRoutes } from './playlist-position/playlist-position.routes';
import { BookRoutes } from './book/book.routes';
import { AbcRoutes } from './abc/abc.routes';
import { HelpRoutes } from './help/help.routes';

export const routes: Routes = [
  ...TuneListRoutes,
  ...TuneRoutes,
  ...TuneAbcRoutes,
  ...SetListRoutes,
  ...FilterRoutes,
  ...PlaylistListRoutes,
  ...PlaylistRoutes,
  ...PlaylistPositionRoutes,
  ...BookRoutes,
  ...AbcRoutes,
  ...HelpRoutes
];
