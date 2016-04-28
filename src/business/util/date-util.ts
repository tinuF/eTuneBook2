import * as moment from 'moment';
import {PlayDate} from '../model/playDate';


export function calculateFrequencyPlayed(playDates:Array<PlayDate>) {
    var today = moment();
    var frequencyPlayed = 0;
    var days = 0;

    for (var i = 0; i < playDates.length; i++) {
        days = 0;
        var checkDay = moment(playDates[i].date);
        days = today.diff(checkDay, 'days');

        if (days < 1000) {
            // Je weiter zurueck, umso weniger Punkte
            frequencyPlayed = frequencyPlayed + 1000;
            frequencyPlayed = frequencyPlayed - days;
        }
    }

    if (frequencyPlayed < 0) {
        frequencyPlayed = 0;
    }

    return frequencyPlayed;
}
