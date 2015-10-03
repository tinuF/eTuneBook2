/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams, Location, OnActivate, OnReuse} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {TuneAbcUI} from '../tune-abc-ui/tune-abc-ui';
import {TuneDotsUI} from '../tune-dots-ui/tune-dots-ui';
import {FromNow} from '../../pipes/from-now';


@Component({
  selector: 'tune-actions',
  properties: ['tune: tune']
})
@View({
  templateUrl: './components/tune-actions-ui/tune-actions-ui.html',
  styleUrls: ['./components/tune-actions-ui/tune-actions-ui.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: [FromNow]
})
export class TuneActionsUI implements DoCheck, OnActivate {
  tune: Tune;
  tuneObjectArray: Array<any>;
  currentState:string;
 
  constructor(public tuneBookService: TuneBookService, public router: Router, routeParams:RouteParams, public location:Location) {
    this.tune = this.tuneBookService.setCurrentTune(routeParams.get('id'));
    this.currentState = "Dots";
    this.renderAbc(this.tune);
    
     // Needed for material-light (Dropdowns...)
    // http://stackoverflow.com/questions/31278781/material-design-lite-integration-with-angularjs
    // TODO: Typescript für componentHandler
     setTimeout(() => {
      componentHandler.upgradeAllRegistered();
    }, 0);
  }
  
  
  doCheck(){
    this.setCurrentState();
    //Versuch, an den Titel heranzukommen. funktioniert nicht
    $(".title.meta-top").css( "color", "red" );
  }
  
  onActivate(next, prev) {
    //alert('OnActivate: Finished navigating from ' + prev.urlPath + ' to ' + next.urlPath);
  }
  
  onReuse(next, prev) {
    //alert('OnReuse: Finished navigating from ' + prev.urlPath + ' to ' + next.urlPath);
  }
  
  setCurrentState(){
    let path= this.location.path();
    
    if (path.indexOf('/tunes/'+this.tune.intTuneId+'/abc', 0) >= 0) {
      this.currentState = "Abc";
    } else if (path.indexOf('/tunes/'+this.tune.intTuneId, 0) >= 0) {
      this.currentState = "Dots";
    }   
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
                scale: 1.0,
                staffwidth: 740,
                paddingtop: 0, 
                paddingbottom: 0,
                paddingright: 0, 
                paddingleft: 0,
                editable: false,
                add_classes: true,
                listener: null
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
        // Transpose up
        this.tuneBookService.tuneUp(this.tune.intTuneId);
        // Show Transposition
        this.renderAbc(this.tune);
        this.tuneBookService.storeTuneBookAbc();
    }

    tuneDown() {
        // Transpose down
        this.tuneBookService.tuneDown(this.tune.intTuneId);
        // Show Transposition
        this.renderAbc(this.tune);
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

