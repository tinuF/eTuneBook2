/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams, Location, OnActivate, OnReuse} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {TuneAbcUI} from '../tune-abc/tune-abc';
import {FromNow} from '../../pipes/from-now';

import {TuneMenuUI} from '../tune-menu/tune-menu';
import {TuneActionsUI} from '../tune-actions/tune-actions';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {TunePlayedUI} from '../tune-played/tune-played';



@Component({
  selector: 'tune',
  templateUrl: './components/tune/tune.html',
  styleUrls: ['./components/tune/tune.css'],
  directives: [ROUTER_DIRECTIVES, TuneMenuUI, TuneActionsUI, TuneDotsUI, TunePlayedUI],
  pipes: [FromNow]
})
export class TuneUI {
  tune: Tune;
 
  constructor(public tuneBookService: TuneBookService, public router: Router, routeParams:RouteParams, public location:Location) {
    this.tune = this.tuneBookService.setCurrentTune(routeParams.get('id'));
  }
  
  
  doCheck(){
  }
  
  showTuneSets() {
  /*
        var sets = eTuneBookService.getTuneSetsByIntTuneId($scope.intTuneId);

        if (sets.length == 0 || sets.length > 1) {
            initActiveMenu();
            $scope.tuneSetsMenuActive = true;
            $state.transitionTo('tunesets', {intTuneId: $scope.intTuneId});
        } else {
            //Tune kommt nur in einem Set vor -> Set-View anzeigen
            $state.transitionTo('set', {tuneSetId: sets[0].tuneSetId});
        }
*/
    }

    showPlaylists() {
/*
        var playlists = eTuneBookService.getPlaylistsByIntTuneId($scope.intTuneId);

        if (playlists.length == 0 || playlists.length > 1) {
            initActiveMenu();
            $scope.playlistsMenuActive = true;
            $state.transitionTo('tuneplaylists', {intTuneId: $scope.intTuneId});
        } else {
            //Tune kommt nur in einer Playlist vor -> Playlist-View anzeigen
            $state.transitionTo('playlist', {playlistId: playlists[0].id, tune:$scope.intTuneId});
        }
*/
    }

    tuneUp() {
        // Transpose up
        this.tuneBookService.tuneUp(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
    }

    tuneDown() {
        // Transpose down
        this.tuneBookService.tuneDown(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
    }

    editTuneInfo() {
        //$state.transitionTo('tuneinfo', {intTuneId: $scope.tune.intTuneId})
    }

    editTune() {
        //$state.transitionTo('tuneabc', {intTuneId: $scope.tune.intTuneId})
    }

    deleteTune() {
        // Delete all TuneSetPositions with that tune
        this.tuneBookService.deleteTuneSetPositionsAndTune(this.tune.intTuneId);
        this.router.navigate('/tunes');
        
        // Put TuneBook to localStorage
        this. tuneBookService.storeTuneBookAbc();   
    }

    loadRandomTune() {
        let intTuneId = this.tuneBookService.getRandomIntTuneId();
        this.router.navigate("/tunes/"+intTuneId);        
        /*
        $scope.$parent.playDateFilter = playDateFilter;
        var intTuneId = eTuneBookService.getRandomIntTuneId(playDateFilter);
        $state.transitionTo('tune', {intTuneId: intTuneId});
        */
    }
}
