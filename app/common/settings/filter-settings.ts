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
    
    filterText:string;
  
  
  constructor(){
    this.key = "All Keys";
    this.type = "All Types";
    this.color = "All Colors";
    this.event = "All Events";
    this.band = "All Bands";
    this.title = "";
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
  
  setFilterText() {
      this.filterText = "";
      
      if (this.type != "All Types") {
          this.filterText = this.filterText + this.type;
      }
      
      if (this.key != "All Keys") {
          if (this.filterText != "") {
              this.filterText = this.filterText + ", ";
          }
          this.filterText = this.filterText + this.key;
      }

      if (this.event != "All Events") {
          if (this.filterText != "") {
              this.filterText = this.filterText + ", ";
          }
          this.filterText = this.filterText + this.event;
      }

      if (this.band != "All Bands") {
          if (this.filterText != "") {
              this.filterText = this.filterText + ", ";
          }
          this.filterText = this.filterText + this.band;
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
} 