//import { SetListComponent } from './set-list.component';

export const SetListRoutes = [
  //{ path: '/sets', component: SetListComponent, terminal: true }
  //lazy loading
  {
    path: 'sets',
    component: '../app/+set-list/set-list.component#SetListComponent',
    terminal: true
  }
];
