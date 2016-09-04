import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BookTitleComponent } from './book-title.component';
import { FilterTextComponent } from './filter-text.component';
import { SideNavigationComponent } from './side-nav.component';
import { SocialNavigationComponent } from './social-nav.component';

import { routes } from './app.routes';

import { TuneBookService } from './business/index';

import { SpinnerModule } from './shared/spinner/spinner.module';

import { AbcModule } from './abc/abc.module';
import { BookModule } from './book/book.module';
import { FilterModule } from './filter/filter.module';
import { HelpModule } from './help/help.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PlaylistListModule } from './playlist-list/playlist-list.module';
import { PlaylistPositionModule } from './playlist-position/playlist-position.module';
import { SetListModule } from './set-list/set-list.module';
import { TuneModule } from './tune/tune.module';
import { TuneAbcModule } from './tune-abc/tune-abc.module';
import { TuneListModule } from './tune-list/tune-list.module';



@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    SpinnerModule,
    AbcModule,
    BookModule,
    FilterModule,
    HelpModule,
    PlaylistModule,
    PlaylistListModule,
    PlaylistPositionModule,
    SetListModule,
    TuneModule,
    TuneAbcModule,
    TuneListModule
  ],
  declarations: [AppComponent, BookTitleComponent, FilterTextComponent, SideNavigationComponent, SocialNavigationComponent],
  exports: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    TuneBookService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
