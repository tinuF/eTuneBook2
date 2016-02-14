export class AbcExportSettings {
    //eTuneBook Directives
    tuneSet: boolean;
    playDate: boolean;
    color: boolean;
    annotation: boolean;
    website: boolean;
    video: boolean;
    playlist: boolean;
    //Standard Abc
    fingering: boolean;

    constructor() {
        this.tuneSet = true;
        this.playDate = true;
        this.color = true;
        this.annotation = true;
        this.website = true;
        this.video = true;
        this.playlist = true;
        this.fingering = true;
    }

    update(tuneSetAbcIncl, playDateAbcIncl, colorAbcIncl, annotationAbcIncl, siteAbcIncl, tubeAbcIncl, playlistAbcIncl, fingeringAbcIncl) {
        this.tuneSet = tuneSetAbcIncl;
        this.playDate = playDateAbcIncl;
        this.color = colorAbcIncl;
        this.annotation = annotationAbcIncl;
        this.website = siteAbcIncl;
        this.video = tubeAbcIncl;
        this.playlist = playlistAbcIncl;
        this.fingering = fingeringAbcIncl;
    }

    includeAtLeastOneEtbkDirective() {
        if (this.tuneSet || this.playDate || this.color || this.annotation || this.website || this.video || this.playlist) {
            return true;
        } else {
            return false;
        }
    }
}
