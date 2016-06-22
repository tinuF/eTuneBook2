//import { TuneListComponent } from './tune-list.component';

export const TuneListRoutes = [
  //{ path: '/tunes', component: TuneListComponent, terminal: true }
  //lazy loading
  {
    path: 'tunes',
    component: '../app/+tune-list/tune-list.component#TuneListComponent',
    terminal: true
  }
];
