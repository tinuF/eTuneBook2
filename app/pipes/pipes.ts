/// <reference path="../typings/_custom.d.ts" />
/*
 * Angular 2
 */
import {Pipes} from 'angular2/change_detection';

/*
 * App Pipes
 */
import {eliminateThe} from './eliminate-the';
import {fromNow} from './from-now';


export var appPipes = [
  Pipes.extend({
    'eliminateThe': eliminateThe,
    'fromNow': fromNow
    // add more pipes to this Map
  })
];