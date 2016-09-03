import { Route } from '@angular/router';
import { TuneComponent } from './tune.component';

export const TuneRoutes: Route[] = [
  {
    path: 'tunes/:id',
    component: TuneComponent
  }
];
