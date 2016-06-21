//import { BookComponent } from './book.component';

export const BookRoutes = [
  //{ path: '/book', component: BookComponent, terminal: true }
  //lazy loading
  {
    path: 'book',
    component: '../app/+book/book.component#BookComponent',
    terminal: true
  }
];
