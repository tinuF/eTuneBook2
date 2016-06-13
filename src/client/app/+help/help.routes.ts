import { HomeComponent } from './home.component';
import { ChangeLogComponent } from './changelog.component';

export const HelpRoutes = [
  { path: '/', component: HomeComponent, index: true },
  { path: '/home', component: HomeComponent, index: true },
  { path: '/changelog', component: ChangeLogComponent, index: true },
];
