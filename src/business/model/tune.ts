import * as moment from 'moment';
import {Color} from './color';
import {Video} from './video';
import {Website} from './website';
import {PlayDate} from './playdate';
import {getAbcValueOfTuneLine, getAbcValue, getSubDirective} from '../util/abc-util';
import {calculateFrequencyPlayed} from '../util/date-util';
import {getSystemProperties} from '../../common/system-properties';

export class Tune {
    systemProperties: any;
    abcjsTune: any;
    intTuneId: number;
    pure: string;
    title: string;
    type: string;
    key: string;
    videos: Array<Video>;
    websites: Array<Website>;
    annotation: string;
    color: Color;
    playDates: Array<PlayDate>;
    lastPlayed: Date;
    frequencyPlayed: number;
    lastModified: Date;

    constructor(abcjsTune: any, intTuneId: number) {
        let systemProperties = getSystemProperties();
        this.systemProperties = systemProperties;
        this.abcjsTune = abcjsTune;
        this.intTuneId = intTuneId;
        this.pure = "";
        this.title = abcjsTune.title;
        this.type = "unkown type";
        this.key = "unkown key";
        this.videos = [];
        this.websites = [];
        this.annotation = "";
        this.color = new Color(null, null, null, systemProperties.DEFAULT_COLOR);
        this.playDates = [];
        this.lastPlayed = null;
        this.lastModified = null;

        this.extractTuneFields();
    }

    extractTuneFields() {
        //Extract eTuneBook-specific fields and purify Abc
        let tuneSplits = this.abcjsTune.pure.split("\n");
        let newAbc = "";
        let isStandardAbc = true;
        let beginOfLine = "";

        for (let i = 0; i < tuneSplits.length; i++) {
            beginOfLine = "";
            isStandardAbc = true;

            // Abc-Standard
            beginOfLine = tuneSplits[i].substring(0, 2);

            if (beginOfLine.length > 1) {

                if (beginOfLine == "R:") {
                    this.type = getAbcValueOfTuneLine(tuneSplits[i], "R:", "undefined").toLowerCase();

                } else if (beginOfLine == "K:") {
                    this.key = getAbcValueOfTuneLine(tuneSplits[i], "K:", "undefined");

                } else if (beginOfLine == "H:") {
                    let tuneModificationString = getAbcValueOfTuneLine(tuneSplits[i], "Modified ", "undefined");

                    if (tuneModificationString != "undefined") {
                        tuneModificationString = tuneModificationString + "T22:00";
                        this.lastModified = moment(tuneModificationString, "YYYY-MM-DDTHH:mm").toDate();
                    }
                }
            }

            // eTuneBook-specific
            beginOfLine = tuneSplits[i].substring(0, 12);

            if (beginOfLine.length > 1) {

                if (beginOfLine == "%%etbk:tnset") {
                    isStandardAbc = false;

                } else if (beginOfLine == "%%etbk:video") {
                    this.videos.push(this.importVideo(getAbcValueOfTuneLine(tuneSplits[i], "%%etbk:video ", "")));
                    isStandardAbc = false;

                } else if (beginOfLine == "%%etbk:wsite") {
                    this.websites.push(new Website(getAbcValueOfTuneLine(tuneSplits[i], "%%etbk:wsite ", "")));
                    isStandardAbc = false;

                } else if (beginOfLine == "%%etbk:annot") {
                    this.annotation = getAbcValueOfTuneLine(tuneSplits[i], "%%etbk:annot ", "");
                    isStandardAbc = false;

                } else if (beginOfLine == "%%etbk:color") {
                    this.color = new Color(null, null, null, getAbcValueOfTuneLine(tuneSplits[i], "%%etbk:color ", this.systemProperties.DEFAULT_COLOR));
                    isStandardAbc = false;

                } else if (beginOfLine == "%%etbk:pldat") {
                    let playDatesString = getAbcValueOfTuneLine(tuneSplits[i], "%%etbk:pldat ", "");
                    this.setPlayDates(this.getPlayDates(playDatesString));
                    isStandardAbc = false;
                }
            }

            if (isStandardAbc) {
                newAbc = newAbc + tuneSplits[i];
                newAbc = newAbc + "\n";
            }
        }

        // Purified Abc setzen
        this.pure = newAbc;
    }

    getSampleAbc(startFromBar: number, numberOfBars: number) {
        let tuneSplits: Array<string> = [];
        let barSplits: Array<string> = [];
        let barSplit = "";
        let barLength = 0;
        let newAbc = "";
        let beginOfLine = "";
        let barPattern = /\|/g;		//matches | globally (every occurence)
        let titleCount = 0;
        let totBarCount = 0;
        let isHeaderLine = false;
        let isNeeded = false;
        let isBar = false;
        let isLastBar = false;
        let isInFocus = true;
        let simulateTitle = false;

        tuneSplits = this.pure.split("\n");

        for (let i = 0; i < tuneSplits.length; i++) {
            isHeaderLine = false;
            isBar = false;
            isNeeded = false;
            simulateTitle = false;

            if (isInFocus) {
                // Abc-Standard
                beginOfLine = tuneSplits[i].substring(0, 2);

                if (beginOfLine == "X:") {
                    isHeaderLine = true;
                    isNeeded = true;
                } else if (beginOfLine == "M:") {
                    isHeaderLine = true;
                    isNeeded = true;
                } else if (beginOfLine == "L:") {
                    isHeaderLine = true;
                    isNeeded = true;
                } else if (beginOfLine == "K:") {
                    isHeaderLine = true;
                    isNeeded = true;
                } else if (beginOfLine == "T:") {
                    isHeaderLine = true;

                    // TODO: titles have to be included -> talk to Paul for options
                    if (titleCount == 0) {
                        // Only print first title
                        simulateTitle = true;
                        isNeeded = true;
                    }
                    titleCount = titleCount + 1;

                } else {

                    barSplits = tuneSplits[i].split("\n");
                    barSplits = barSplits[0].split("|");

                    // Annahmen:
                    //-Es gibt keine Takte, die ueber zwei Zeilen verteilt sind.

                    // Es braucht im Minimum einen Takt-Strich als Hinweise daf�r,
                    // dass es sich um eine Dots-Line handelt
                    // Erster Takt-Strich am Beginn der Line gibt ein String mit 0 Zeichen

                    if (barSplits.length <= 1) {
                        isHeaderLine = true;
                        isNeeded = false;

                    } else {

                        for (let z = 0; z < barSplits.length; z++) {
                            barSplit = barSplits[z].replace(/^\s+|\s+$/g, '');

                            if (isInFocus) {
                                isBar = false;
                                isNeeded = false;
                                barLength = barSplit.length;

                                if (barLength == 0) {
                                    // -Takt-Strich am Beginn der Linie (es hat vorher keine anderen Zeichen), oder
                                    // -Takt-Strich am Ende der Linie
                                    // -Doppel-Taktstrich (kein Zeichen zwischen den Takt-Strichen)
                                    // Hinweise:
                                    // -Ein Takt-Strich am Schluss der Line haette barLength == 1, wenn der
                                    // Zeilenumbruch nicht rausgenommen wuerde.
                                    // -Es gibt aber auch nach dem Rausnehmen des Zeilenumgruchs noch letzte Takt-Striche
                                    // mit barLength == 1. Dort sind versteckte Zeichen drin, die auch zu einem Zeilenumbruch f�hren.
                                    // Mit obiger replace-Funktion werden diese entfernt.
                                    //
                                } else if (barLength < 4) {
                                    // Auftakt (Annahme: Maximum 3 Zeichen)
                                    // TODO: Auftakte mit Fingering, oder Triolen z�hlen noch als Takte, weil barLength >= 4!
                                    isNeeded = true;
                                } else {
                                    // Minimum 4 Zeichen
                                    isBar = true;
                                    totBarCount = totBarCount + 1;
                                }

                                if (isBar) {
                                    if (startFromBar <= totBarCount && totBarCount < startFromBar + numberOfBars) {
                                        isNeeded = true;

                                        if (totBarCount == startFromBar + numberOfBars - 1) {
                                            isLastBar = true;
                                        }
                                    } else {
                                        // Erster Takt, der nicht mehr im Anzeige-Bereich ist.
                                        isInFocus = false;
                                    }
                                }

                                if (isNeeded) {
                                    newAbc = newAbc + barSplit;
                                    newAbc = newAbc + "|";

                                    if (isLastBar) {
                                        // N�chster Takt nicht mehr in Fokus
                                        isInFocus = false;
                                    }
                                }
                            }
                        }
                    }
                }

                if (isHeaderLine && isNeeded) {
                    if (simulateTitle) {
                        newAbc = newAbc + "T: ";
                        newAbc = newAbc + "\n";
                    } else {
                        newAbc = newAbc + tuneSplits[i];
                        newAbc = newAbc + "\n";
                    }
                }
            }
        }

        return newAbc;

    }

    setLastPlayed() {
        // TODO: Sort playDates
        if (this.playDates.length == 0) {
            return this.lastPlayed = null;
        } else {
            return this.lastPlayed = this.playDates[0].date;
        }
    }

    setPlayDates(playDates: Array<PlayDate>) {
        this.playDates = playDates;
        this.setLastPlayed();
    }

    addVideo(videoSource: string, videoCode: string, videoDescription: string) {
        let video: Video;

        //Todo: Don't add if source/code already exists.
        video = new Video(videoSource, videoCode, videoDescription);
        this.videos.push(video);
        return video;
    }

    addWebsite(url: string) {
        let website: Website;

        //Todo: Don't add if url already exists.
        website = new Website(url);
        this.websites.push(website);
        return website;
    }

    deleteWebsite(url: string) {
        let index: number;
        let remove = false;

        for (let i = 0; i < this.websites.length; i++) {
            if (url == this.websites[i].url) {
                index = i;
                remove = true;
            }
        }
        // Website löschen
        if (remove) {
            this.websites.splice(index, 1);
        }
    }

    getVideoById(videoSource: string, videoCode: string): Video {

        for (let i = 0; i < this.videos.length; i++) {
            if (videoSource == this.videos[i].source && videoCode == this.videos[i].code) {
                return this.videos[i];
            }
        }

        return null;
    }

    deleteVideo(videoSource: string, videoCode: string) {
        let index: number;
        let remove = false;

        for (let i = 0; i < this.videos.length; i++) {
            if (videoSource == this.videos[i].source && videoCode == this.videos[i].code) {
                index = i;
                remove = true;
            }
        }
        // Video löschen
        if (remove) {
            this.videos.splice(index, 1);
        }
    }

    getTuneKey() {
        return getAbcValue(this.pure, "K:", "undefined");
    }

    getTuneTitle() {
        return getAbcValue(this.pure, "T:", "undefined");
    }

    getTuneType() {
        return getAbcValue(this.pure, "R:", "undefined").toLowerCase();
    }

    getTuneId() {
        return getAbcValue(this.pure, "X:", "undefined");
    }

    getTuneSite(siteType: string) {
        let siteDirective = "%%etbk:" + siteType + " ";
        return getAbcValue(this.pure, siteDirective, "");
    }

    getPlayDates(tuneLine: string) {
        let playDates: Array<PlayDate> = [];
        let playDate = new Date();
        let playDatesSplits: Array<string> = [];

        playDatesSplits = tuneLine.split(",");

        for (let i = 0; i < playDatesSplits.length; i++) {
            //moment kann nicht verwendet werden, weil Object mit methoden, und Object kann folglich nicht aus localStorage restored werden.
            //playDate = newPlayDate(moment(playDatesSplits[i], "YYYY-MM-DDTHH:mm"));
            playDate = moment(playDatesSplits[i], "YYYY-MM-DDTHH:mm").toDate();
            playDates.push(new PlayDate(playDate));
        }

        return playDates;
    }

    addPlayDate(newDate: Date) {
        if (this.lastPlayed != null && moment(this.lastPlayed).diff(newDate, "minutes") == 0) {
            // Power-Clicker
            // Do nothing

        } else {
            // Set LastPlayed
            this.lastPlayed = newDate;

            // Put LastPlayed on first Position in the playDates-Array
            this.playDates.unshift(new PlayDate(this.lastPlayed));

            // Calculate Frequency Played
            this.frequencyPlayed = calculateFrequencyPlayed(this.playDates);
        }
    }

    importVideo(videoDirective: string) {
        return new Video(this.importVideoSource(videoDirective), this.importVideoCode(videoDirective), this.importVideoDescription(videoDirective));
    }

    importVideoSource(videoDirective: string) {
        return getSubDirective(videoDirective, "src:", ",");
    }

    importVideoCode(videoDirective: string) {
        return getSubDirective(videoDirective, "cde:", ",");
    }

    importVideoDescription(videoDirective: string) {
        return getSubDirective(videoDirective, "desc:", "\n");
    }

}
