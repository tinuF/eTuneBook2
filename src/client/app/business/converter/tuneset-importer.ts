import {TuneSet, TuneSetPosition, Tune } from '../model/index';
import { getAbcValues, calculateFrequencyPlayed, eliminateThe } from '../util/index';

export function importTuneSets(abcjsBook: any) {
    // Generate TuneSets from the abcjsBook.

    let allTuneSetPositions: Array<TuneSetPosition> = [];
    let tunesWithoutTuneSetDirective: Array<any> = [];
    let tuneSetDirectives: Array<string> = [];
    let tuneSets: Array<TuneSet> = [];
    let tune: Tune = null;
    let tuneId = 1;

    // Generate TuneSetPositions
    for (let i = 0; i < abcjsBook.tunes.length; i++) {
        let abcjsTune = abcjsBook.tunes[i];
        tuneSetDirectives = [];
        tuneSetDirectives = getAbcValues(abcjsTune.pure, '%%etbk:tnset ');

        if (tuneSetDirectives.length > 0) {
            // Tune that was exported from eTuneBook
            // The tune can have one or more tuneSetDirective
            tune = new Tune(abcjsTune, tuneId);

            for (let y = 0; y < tuneSetDirectives.length; y++) {
                // Get tuneSetId, position, repeat
                let tuneSetId = importTuneSetId(tuneSetDirectives[y]);
                let position = importTuneSetTunePosition(tuneSetDirectives[y]);
                let repeat = importTuneSetTuneRepeat(tuneSetDirectives[y]);
                let annotation = importTuneSetTuneAnnotation(tuneSetDirectives[y]);

                // Generate tuneSetPosition
                let tuneSetPosition: TuneSetPosition;
                tuneSetPosition = new TuneSetPosition(tuneSetId, tune, position, repeat, annotation);
                allTuneSetPositions.push(tuneSetPosition);
            }

            tuneId++;

        } else {
            // Zwischenspeichern und sp�ter aufgrund der dynamisch ermittelten maxTuneSetId generieren
            // Entweder Fehlerfall (wenn eTuneBook, dann muss in jedem Tune ein TuneSet-Directive stehen)
            // Oder TuneBook, dass noch nie durch eTuneBook gespeichert wurde.
            tunesWithoutTuneSetDirective.push(abcjsTune);
        }
    }

    // Sort TuneSetPositions by TuneSetId
    allTuneSetPositions.sort(function (a, b) {
        return a.tuneSetId - b.tuneSetId;
    });

    // Generate TuneSets from Tunes with TuneSetDirectives
    let wTuneSetId = 0;

    for (let i = 0; i < allTuneSetPositions.length; i++) {

        if (wTuneSetId !== allTuneSetPositions[i].tuneSetId) {
            // First TuneSetPosition of new tuneSetId
            wTuneSetId = allTuneSetPositions[i].tuneSetId;

            let tuneSet: TuneSet;
            let tuneSetName = '';
            let tuneSetPositions: Array<TuneSetPosition> = [];

            // Get all tuneSetPositions for wTuneSetId
            for (let z = 0; z < allTuneSetPositions.length; z++) {
                let tuneSetPosition: TuneSetPosition = allTuneSetPositions[z];

                if (wTuneSetId === tuneSetPosition.tuneSetId) {
                    tuneSetPositions.push(tuneSetPosition);

                    if (tuneSetPosition.position === 1) {
                        //Name of TuneSet = Name of first tune
                        tuneSetName = eliminateThe(tuneSetPosition.tune.title);
                        tuneSetName += ' Set';
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

    for (let i = 0; i < tunesWithoutTuneSetDirective.length; i++) {
        let tuneSet: TuneSet;
        let tuneSetPositions: Array<TuneSetPosition> = [];
        let tuneSetPosition: TuneSetPosition;
        let tune: Tune;

        tune = new Tune(tunesWithoutTuneSetDirective[i], tuneId);

        tuneSetPosition = new TuneSetPosition(wTuneSetId, tune, 1, '3x', '');
        tuneSetPositions.push(tuneSetPosition);
        tuneSet = new TuneSet(wTuneSetId, tune.title, tuneSetPositions);
        tuneSets.push(tuneSet);
        tuneId++;
        wTuneSetId++;
    }

    return tuneSets;
}

function importTuneSetId(tuneSetDirective: string): number {
    let tuneSetId: string;
    let tuneSetIdSplits: Array<string> = [];

    tuneSetIdSplits = tuneSetDirective.split('id:');

    if (tuneSetIdSplits.length > 1) {
        tuneSetIdSplits = tuneSetIdSplits[1].split(',');
        tuneSetId = tuneSetIdSplits[0].replace(/^\s+|\s+$/g, '');
    }

    return parseInt(tuneSetId);
}

function importTuneSetTunePosition(tuneSetDirective: string): number {
    let tuneSetTunePosition: string;
    let tuneSetTunePositionSplits: Array<string> = [];

    tuneSetTunePositionSplits = tuneSetDirective.split('pos:');

    if (tuneSetTunePositionSplits.length > 1) {
        tuneSetTunePositionSplits = tuneSetTunePositionSplits[1].split(',');
        tuneSetTunePosition = tuneSetTunePositionSplits[0].replace(/^\s+|\s+$/g, '');
    }

    return parseInt(tuneSetTunePosition);
}

function importTuneSetTuneRepeat(tuneSetDirective: string): string {
    let tuneSetTuneRepeat: string;
    let tuneSetTuneRepeatSplits: Array<string> = [];

    tuneSetTuneRepeatSplits = tuneSetDirective.split('rep:');

    if (tuneSetTuneRepeatSplits.length > 1) {
        tuneSetTuneRepeatSplits = tuneSetTuneRepeatSplits[1].split(',');
        tuneSetTuneRepeat = tuneSetTuneRepeatSplits[0].replace(/^\s+|\s+$/g, '');
    }

    return tuneSetTuneRepeat;
}

function importTuneSetTuneAnnotation(tuneSetDirective: string): string {
    let tuneSetTuneAnnotation: string = '';
    let tuneSetTuneAnnotationSplits: Array<string> = [];

    tuneSetTuneAnnotationSplits = tuneSetDirective.split('ant:');

    if (tuneSetTuneAnnotationSplits.length > 1) {
        tuneSetTuneAnnotationSplits = tuneSetTuneAnnotationSplits[1].split(',');
        tuneSetTuneAnnotation = tuneSetTuneAnnotationSplits[0].replace(/^\s+|\s+$/g, '');
    }

    return tuneSetTuneAnnotation;
}
