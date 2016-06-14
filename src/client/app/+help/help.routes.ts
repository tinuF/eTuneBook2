import { WelcomeComponent } from './welcome.component';
import { ChangeLogComponent } from './changelog.component';
import { CreditsComponent } from './credits.component';
import { FeedbackComponent } from './feedback.component';

export const HelpRoutes = [
  { path: '/', component: WelcomeComponent, index: true },
  { path: '/welcome', component: WelcomeComponent, index: true },
  { path: '/changelog', component: ChangeLogComponent, index: true },
  { path: '/credits', component: CreditsComponent, index: true },
  { path: '/feedback', component: FeedbackComponent, index: true },
];
