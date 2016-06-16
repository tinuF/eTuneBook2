import { WelcomeComponent } from './welcome.component';
import { ChangeLogComponent } from './changelog.component';
import { CreditsComponent } from './credits.component';
import { FeedbackComponent } from './feedback.component';

export const HelpRoutes = [
  { path: '/', component: WelcomeComponent, terminal: true },
  { path: '/welcome', component: WelcomeComponent, terminal: true },
  { path: '/changelog', component: ChangeLogComponent, terminal: true },
  { path: '/credits', component: CreditsComponent, terminal: true },
  { path: '/feedback', component: FeedbackComponent, terminal: true },
];
