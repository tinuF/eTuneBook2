import { Route } from '@angular/router';
import { TuneAbcComponent } from './tune-abc.component';

export const TuneAbcRoutes: Route[] = [
  {
    path: 'tunes/:id/abc',
    component: TuneAbcComponent
  }
];
