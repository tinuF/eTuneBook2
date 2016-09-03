import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChangeLogComponent } from './changelog.component';
import { CreditsComponent } from './credits.component';
import { FeedbackComponent } from './feedback.component';
import { InfoMenuComponent } from './info-menu.component';
import { WelcomeComponent } from './welcome.component';

@NgModule({
    imports: [RouterModule],
    declarations: [ChangeLogComponent, CreditsComponent, FeedbackComponent, InfoMenuComponent, WelcomeComponent],
    exports: [ChangeLogComponent, CreditsComponent, FeedbackComponent, InfoMenuComponent, WelcomeComponent]
})
export class HelpModule { }
