import { WelcomeComponent } from './welcome.component';
import { ChangeLogComponent } from './changelog.component';
import { CreditsComponent } from './credits.component';
import { FeedbackComponent } from './feedback.component';

export const HelpRoutes = [
  {
    path: '',
    //component: '../app/+help/welcome.component#WelcomeComponent',
    component: WelcomeComponent,
    terminal: true
  },
  {
    path: 'welcome',
    //component: '../app/+help/welcome.component#WelcomeComponent',
    component: WelcomeComponent,
    terminal: true
  },
  {
    path: 'changelog',
    //component: '../app/+help/changelog.component#ChangeLogComponent',
    component: ChangeLogComponent,
    terminal: true
  },
  {
    path: 'credits',
    //component: '../app/+help/credits.component#CreditsComponent',
    component: CreditsComponent,
    terminal: true
  },
  {
    path: 'feedback',
    //component: '../app/+help/feedback.component#FeedbackComponent',
    component: FeedbackComponent,
    terminal: true
  }
];
