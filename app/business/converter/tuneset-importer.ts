import {TuneSet} from '../model/tuneset';
import {TuneSetPosition} from '../model/tunesetposition';
import {Tune} from '../model/tune';
import {Video} from '../model/video';
import {getAbcValues, getAbcValueOfTuneLine, getSubDirective} from '../util/abc';
import {calculateFrequencyPlayed} from '../util/date';
import {eliminateThe} from '../util/text';


export function importTuneSets(abcjsBook){
  // Generate TuneSets from the abcjsBook.

  var allTuneSetPositions: Array<TuneSetPosition> = [];
  var tunesWithoutTuneSetDirective: Array<Tune> = [];
  var tuneSetDirectives = [];
  var tuneSets: Array<TuneSet> = [];
  var tune: Tune = null;
  var intTuneSetId = 1;
  var intTuneId = 1;

  // Generate TuneSetPositions
  for (var i = 0; i < abcjsBook.tunes.length; i++) {
    var abcjsTune = abcjsBook.tunes[i];
    tuneSetDirectives = [];
    tuneSetDirectives = getAbcValues(abcjsTune.pure, "%%etbk:tnset ");

    if (tuneSetDirectives.length > 0){
      // Tune that was exported from eTuneBook
      // The tune can have one or more tuneSetDirective
      tune = new Tune(abcjsTune, intTuneId);

      for (var y = 0; y < tuneSetDirectives.length; y++) {
        // Get tuneSetId, position, repeat
        var tuneSetId = _importTuneSetId(tuneSetDirectives[y]);
        var position = _importTuneSetTunePosition(tuneSetDirectives[y]);
        var repeat = _importTuneSetTuneRepeat(tuneSetDirectives[y]);
        var annotation = _importTuneSetTuneAnnotation(tuneSetDirectives[y]);

        // Generate tuneSetPosition
        var tuneSetPosition: TuneSetPosition;
        tuneSetPosition = new TuneSetPosition(tuneSetId, tune, position, repeat, annotation);
        allTuneSetPositions.push(tuneSetPosition);
      }

      intTuneId++;

    } else {
      // Zwischenspeichern und sp�ter aufgrund der dynamisch ermittelten maxTuneSetId generieren
      // Entweder Fehlerfall (wenn eTuneBook, dann muss in jedem Tune ein TuneSet-Directive stehen)
      // Oder TuneBook, dass noch nie durch eTuneBook gespeichert wurde.
      tunesWithoutTuneSetDirective.push(tune);
    }
  }

  // Sort TuneSetPositions by TuneSetId
  allTuneSetPositions.sort(function(a, b){
    return a.tuneSetId-b.tuneSetId
  });

  // Generate TuneSets from Tunes with TuneSetDirectives
  var wTuneSetId = 0;
  for (var i = 0; i < allTuneSetPositions.length; i++) {

    if (wTuneSetId !== allTuneSetPositions[i].tuneSetId){
      // First TuneSetPosition of new tuneSetId
      wTuneSetId = allTuneSetPositions[i].tuneSetId;

      var tuneSet: TuneSet;
      var tuneSetName = "";
      var tuneSetPositions = [];

      // Get all tuneSetPositions for wTuneSetId
      for (var z = 0; z < allTuneSetPositions.length; z++) {
        var tuneSetPosition: TuneSetPosition = allTuneSetPositions[z];

        if (wTuneSetId == tuneSetPosition.tuneSetId){
          tuneSetPositions.push(tuneSetPosition);

          if (tuneSetPosition.position == "1"){
            //Name of TuneSet = Name of first tune
            tuneSetName = eliminateThe(tuneSetPosition.tune.title);
            tuneSetName += " Set";
          }
          tuneSetPosition.tune.frequencyPlayed = calculateFrequencyPlayed(tuneSetPosition.tune.playDates);
        }
      }

      tuneSet = new TuneSet(wTuneSetId, tuneSetName, tuneSetPositions);
      tuneSets.push(tuneSet);
    }
  }

  // Generate TuneSets from tunesWithoutTuneSetDirective
  // Get next free TuneSetId
  wTuneSetId++;

  for (var i = 0; i < tunesWithoutTuneSetDirective.length; i++) {
    var tuneSet: TuneSet;
    var tuneSetType = "";
    var frequencyPlayed = 0;
    var tuneSetPositions = [];
    var tuneSetPosition: TuneSetPosition;
    var tune: Tune = tunesWithoutTuneSetDirective[i];

    tune = new Tune(abcjsTune, intTuneId);

    tuneSetPosition = new TuneSetPosition(wTuneSetId, tune, 1, "3x", "");
    tuneSetPositions.push(tuneSetPosition);
    tuneSet = new TuneSet(wTuneSetId, tune.title, tuneSetPositions);
    tuneSets.push(tuneSet);
    intTuneId++;
    wTuneSetId++;
  }

  return tuneSets;
}

function _importTuneSetId(tuneSetDirective){
  var tuneSetId = '0';
  var tuneSetIdSplits = [];
  tuneSetIdSplits = tuneSetDirective.split("id:");
  if  (tuneSetIdSplits.length > 1){
    tuneSetIdSplits = tuneSetIdSplits[1].split(",");
    tuneSetId = tuneSetIdSplits[0].replace(/^\s+|\s+$/g, '');
  }

  return parseInt(tuneSetId);
}

function _importTuneSetTunePosition(tuneSetDirective){
  var tuneSetTunePosition = "undefined";
  var tuneSetTunePositionSplits = [];
  tuneSetTunePositionSplits = tuneSetDirective.split("pos:");
  if  (tuneSetTunePositionSplits.length > 1){
    tuneSetTunePositionSplits = tuneSetTunePositionSplits[1].split(",");
    tuneSetTunePosition = tuneSetTunePositionSplits[0].replace(/^\s+|\s+$/g, '');
  }
  return tuneSetTunePosition;
}

function _importTuneSetTuneRepeat(tuneSetDirective){
  var tuneSetTuneRepeat = "undefined";
  var tuneSetTuneRepeatSplits = [];
  tuneSetTuneRepeatSplits = tuneSetDirective.split("rep:");
  if  (tuneSetTuneRepeatSplits.length > 1){
    tuneSetTuneRepeatSplits = tuneSetTuneRepeatSplits[1].split(",");
    tuneSetTuneRepeat = tuneSetTuneRepeatSplits[0].replace(/^\s+|\s+$/g, '');
  }
  return tuneSetTuneRepeat;
}

function _importTuneSetTuneAnnotation(tuneSetDirective){
  var tuneSetTuneAnnotation = "";
  var tuneSetTuneAnnotationSplits = [];
  tuneSetTuneAnnotationSplits = tuneSetDirective.split("ant:");
  if  (tuneSetTuneAnnotationSplits.length > 1){
    tuneSetTuneAnnotationSplits = tuneSetTuneAnnotationSplits[1].split(",");
    tuneSetTuneAnnotation = tuneSetTuneAnnotationSplits[0].replace(/^\s+|\s+$/g, '');
  }
  return tuneSetTuneAnnotation;
}
