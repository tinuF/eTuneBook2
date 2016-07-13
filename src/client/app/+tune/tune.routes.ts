import { TuneComponent } from './tune.component';

export const TuneRoutes = [
  {
    path: 'tunes/:id',
    //component: '../app/+tune/tune.component#TuneComponent',
    component: TuneComponent,
    terminal: true
  }
];
