export class AbcOption {
  
  tuneSet: boolean;
  playDate: boolean;
  color: boolean;
  annotation: boolean;
  website: boolean;
  video: boolean;
  playlist: boolean;
  //Standard Abc
  fingering: boolean;
  
  constructor(tuneSetAbcIncl, playDateAbcIncl, skillAbcIncl, colorAbcIncl, annotationAbcIncl, siteAbcIncl, tubeAbcIncl, playlistAbcIncl, fingeringAbcIncl){
    //eTuneBook Directives
    this.tuneSet = tuneSetAbcIncl;
    this.playDate = playDateAbcIncl;
    this.color = colorAbcIncl;
    this.annotation = annotationAbcIncl;
    this.website = siteAbcIncl;
    this.video = tubeAbcIncl;
    this.playlist = playlistAbcIncl;
    //Standard Abc
    this.fingering = fingeringAbcIncl;
  }

  includeAtLeastOneEtbkDirective(){
    if (this.tuneSet || this.playDate ||  this.color || this.annotation || this.website || this.video || this.playlist) {
      return true;
    } else {
      return false;
    }
  }
}
