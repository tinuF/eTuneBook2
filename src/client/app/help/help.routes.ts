import { Route } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { ChangeLogComponent } from './changelog.component';
import { CreditsComponent } from './credits.component';
import { FeedbackComponent } from './feedback.component';

export const HelpRoutes: Route[] = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'changelog',
    component: ChangeLogComponent
  },
  {
    path: 'credits',
    component: CreditsComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  }
];
