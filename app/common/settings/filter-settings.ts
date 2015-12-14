export class FilterSettings {
    title:string;
    key:string;
    type:string;
    color:string;
    event:string;
    band:string;
    plmin:string;
    plmax:string;
    freqcomp:string;
    freq:string;
    updmin:string;
    updmax:string;
    setIds:Array<number>;
    applySetIds:boolean;
    playlistIds:Array<number>;
    applyPlaylistIds:boolean;
    filterText:string;
  
  
  constructor(){
    this.key = "All Keys";
    this.type = "All Types";
    this.color = "All Colors";
    this.event = "All Events";
    this.band = "All Bands";
    this.title = "";
    this.setIds = [];
    this.applySetIds = false;
    this.playlistIds = [];
    this.applyPlaylistIds = false;
    /*TODO
    plmin:string;
    plmax:string;
    freqcomp:string;
    freq:string;
    updmin:string;
    updmax:string;
    */
  }
  
  setKey(key:string){
    this.key = key;
    this.setFilterText();    
  }
  
  setType(type:string){
    this.type = type;
    this.setFilterText();    
  }
  
  setColor(color:string){
    this.color = color;
    this.setFilterText();    
  }
  
  setEvent(event:string){
    this.event = event;
    this.setFilterText();    
  }
  
  setBand(band:string){
    this.band = band;
    this.setFilterText();    
  }
  
  setTitle(title:string){
    this.title = title;
  }
  
  addSetId(setId:number){
    this.setIds.push(setId);
    this.setFilterText();
  }
  
  removeSetId(setId:number){
    let index = this.setIds.indexOf(setId);
    if (index > -1) {
      this.setIds.splice(index, 1);
    }
    this.setFilterText();
  }
  
  toggleSetIdFilter(){
    this.applySetIds = !this.applySetIds;
    this.setFilterText();
  }
  
  addPlaylistId(playlistId:number){
    this.playlistIds.push(playlistId);
  }
  
  removePlaylistId(playlistId:number){
    let index = this.playlistIds.indexOf(playlistId);
    if (index > -1) {
      this.playlistIds.splice(index, 1);
    }
  }
  
  togglePlaylistIdFilter(){
    this.applyPlaylistIds = !this.applyPlaylistIds;
  }
  
  setFilterText() {
      this.filterText = "";
      
      if (this.type != "All Types" || this.key != "All Keys" || this.event != "All Events" || this.band != "All Bands" || this.applySetIds) {
        //this.filterText = "Filter: "
        if (this.type != "All Types") {
          this.filterText = this.filterText + this.type;
        }

        if (this.key != "All Keys") {
          this.addComma();
          this.filterText = this.filterText + this.key;
        }

        if (this.event != "All Events") {
          this.addComma();
          this.filterText = this.filterText + this.event;
        }

        if (this.band != "All Bands") {
          this.addComma();
          this.filterText = this.filterText + this.band;
        }
        
        if (this.applySetIds && this.setIds.length > 0) {
          this.addComma();
          this.filterText = this.filterText + "Sets [";
          
          for (var i = 0; i < this.setIds.length; i++) {
            if (i > 0) {
              this.addComma();
            }
            this.filterText = this.filterText + this.setIds[i];
          }
          this.filterText = this.filterText + "]";
        }
      }
      

/*TODO
      if (this.filterSettings.plmin != null && this.filterSettings.plmin != "") {
          if (this.currentFilter != "") {
              this.currentFilter = this.currentFilter + ", ";
          }
          this.currentFilter = this.currentFilter + "played ";

          if (this.filterSettings.plmax != null && this.filterSettings.plmax != "") {

          } else {
              this.currentFilter = this.currentFilter + "from ";
          }

          this.currentFilter = this.currentFilter + this.filterSettings.plmin;
      }

      if (this.filterSettings.plmax != null && this.filterSettings.plmax != "") {
          if (this.filterSettings.plmin != null && this.filterSettings.plmin != "") {
              this.currentFilter = this.currentFilter + "-";
          } else if (this.currentFilter != "") {
              this.currentFilter = this.currentFilter + ",played to ";
          }
          this.currentFilter = this.currentFilter + this.filterSettings.plmax;
      }
      */
  }
  
  addComma() {
    if (this.filterText != "") {
      this.filterText = this.filterText + ", ";
    }
  }
} 