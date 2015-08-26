/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, LifecycleEvent} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, Router, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';

import {TuneAbcUI} from '../../components/tune-abc-ui/tune-abc-ui';
//import {App} from '../../../app/app';


@Component({
  selector: 'tune',
  lifecycle: [LifecycleEvent.onCheck]
})
//@RouteConfig([
  // This is only accepted, when there's a partial root in the parent:
  // { path: '/tunes/:id/...', component: TuneUI, as: 'tune' }
  // however, this then breaks navigation to /tunes/:id/ 
  //{ path: '/abc', component: TuneAbcUI, as: 'tuneabc' }
//
//])
@View({
  templateUrl: './components/tune-ui/tune-ui.html?v=<%= VERSION %>',
  directives: [RouterOutlet, RouterLink, NgFor]
})
export class TuneUI {
  tune: Tune;
  tuneObjectArray: Array<any>;
  currentState:string;
  tuneSetsMenuActive:boolean;
  tuneVideosMenuActive:boolean;
  tuneAbcMenuActive:boolean;
  tunePracticeMenuActive:boolean;
  tuneInfoMenuActive:boolean;
 
  constructor(public tuneBookService: TuneBookService, public router: Router, routeParams:RouteParams) {
    this.tune = this.tuneBookService.setCurrentTune(routeParams.get('id'));
    this.currentState = "Dots";
    this.renderAbc(this.tune);
  }
  
  onCheck(){
    
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

    showTuneVideos() {
     /*
        initActiveMenu();
        $scope.tuneVideosMenuActive = true;
        $state.transitionTo('tunevideos', {intTuneId: $scope.intTuneId});
        */
    }

    showTuneAbc() {
        this.initActiveMenu();
        this.tuneAbcMenuActive = true;
        this.router.navigate("/tune/"+this.tune.intTuneId+"/abc");
    }

    showTunePractice() {
        /*
        initActiveMenu();
        $scope.tunePracticeMenuActive = true;
        $state.transitionTo('tunepractice', {intTuneId: $scope.intTuneId});
        */
    }

    showTuneInfo() {
        /*
        initActiveMenu();
        $scope.tuneInfoMenuActive = true;
        $state.transitionTo('tuneinfo', {intTuneId: $scope.intTuneId});
    */
    }

    initActiveMenu(){
        this.tuneSetsMenuActive = false;
        this.tuneVideosMenuActive = false;
        this.tuneAbcMenuActive = false;
        this.tunePracticeMenuActive = false;
        this.tuneInfoMenuActive = false;
    }

    renderAbc(tune) {
        //Render Abc
        //Important: Has to be timed-out, otherwise fingerings won't show up
        //Compare with tbkTuneFocus: ABCJS.Editor also timed-out -> fingerings show up
        //Compare with tbkPopover: ABCJS.renderAbc is not timed-out -> fingerings dont' show (timeout in popover -> no popover is shown)
        setTimeout(() => {
            let output = 'DotsForTune' + this.tune.intTuneId;
            let tunebookString = this.skipFingering(this.tune.pure);
            let parserParams = {};
            let engraverParams = {
                scale: 1.0
            };
            let renderParams = {
            };


            this.tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams)
        }, 0);
    }
    
    skipFingering(tuneAbc) {
        //Todo: skipFingering
        /*
        if (!$scope.fingeringAbcIncl) {
            tuneAbc = tuneAbc.replace(eTBk.PATTERN_FINGER, '');
        }
        */
        return tuneAbc;
    }

    tuneUp() {
        /*
        // Transpose up
        eTuneBookService.tuneUp($scope.intTuneId);
        // Show Transposition
        renderAbc($scope.tune);
        eTuneBookService.storeTuneBookAbc();
    */
    }

    tuneDown() {
        /*
        // Transpose down
        eTuneBookService.tuneDown($scope.intTuneId);
        // Show Transposition
        renderAbc($scope.tune);
        eTuneBookService.storeTuneBookAbc();
   */
    }

    editTuneInfo() {
        //$state.transitionTo('tuneinfo', {intTuneId: $scope.tune.intTuneId})
    }

    editTune() {
        //$state.transitionTo('tuneabc', {intTuneId: $scope.tune.intTuneId})
    }

    deleteTune() {
        /*
        // Delete all TuneSetPositions with that tune
        eTuneBookService.deleteTuneSetPositionsAndTune($scope.tune.intTuneId);
        $state.transitionTo('tunelist');
        //Ein state zurück geht nur, wenn der Delete-Button im State 'tune' gedrückt wurde
        //Der Delete-Button wird aber auch auf den Sub-States von tune angeboten
        //$state.transitionTo($rootScope.$previousState, $rootScope.$previousStateParams);

        // Put TuneBook to localStorage
        eTuneBookService.storeTuneBookAbc();
        */
    }

    justPlayedTheTune(tune) {
        /*
        var now = new Date();
        eTuneBookService.addTunePlayDate(tune, now);
        eTuneBookService.storeTuneBookAbc();
    */
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

    /*
    $scope.$watch(function () { return $state.is('tune'); }, function() {
        if ($state.is('tune')){
            $scope.currentState = "Dots";
        }
    });
    */
}

