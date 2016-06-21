//import { AbcComponent } from './abc.component';

export const AbcRoutes = [
  //{ path: '/abc', component: AbcComponent, terminal: true }
  //lazy loading
  {
    path: 'abc',
    component: '../app/+abc/abc.component#AbcComponent',
    terminal: true
  }
];
