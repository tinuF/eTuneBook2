//import { TuneAbcComponent } from './tune-abc.component';

export const TuneAbcRoutes = [
  //{ path: '/tunes/:id/abc', component: TuneAbcComponent, terminal: true }
  //lazy loading
  {
    path: '/tunes/:id/abc',
    component: '../app/+tune-abc/tune-abc.component#TuneAbcComponent',
    terminal: true
  }
];
