import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TuneColorizerModule } from '../shared/tune/tune-colorizer.module';
import { TuneTransposerModule } from '../shared/tune/tune-transposer.module';
import { TunePlayedModule } from '../shared/tune/tune-played.module';

import { TuneAbcComponent } from './tune-abc.component';
import { TuneAbcEditorComponent } from './editor/tune-abc-editor.component';
import { TuneAbcMenuComponent } from './menu/tune-abc-menu.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TuneColorizerModule,
    TuneTransposerModule,
    TunePlayedModule
  ],
  declarations: [
    TuneAbcComponent,
    TuneAbcEditorComponent,
    TuneAbcMenuComponent
  ],
  exports: [
    TuneAbcComponent
  ]
})
export class TuneAbcModule { }
