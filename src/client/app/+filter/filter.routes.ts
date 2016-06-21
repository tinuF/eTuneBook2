//import { FilterComponent } from './filter.component';

export const FilterRoutes = [
  //{ path: '/filter', component: FilterComponent, terminal: true }
  //lazy loading
  {
    path: 'filter',
    component: '../app/+filter/filter.component#FilterComponent',
    terminal: true
  }
];
