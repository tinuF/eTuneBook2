//import { TuneComponent } from './tune.component';

export const TuneRoutes = [
  //{ path: '/tunes/:id', component: TuneComponent, terminal: true }
  //lazy loading
  {
    path: 'tunes/:id',
    component: '../app/+tune/tune.component#TuneComponent',
    terminal: true
  }
];
