import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { TuneBookService, TuneBook, AbcExportSettings } from '../business/index';

@Component({
  moduleId: module.id,
  selector: 'etb-abc',
  templateUrl: 'abc.component.component.html',
  styleUrls: ['abc.component.component.css'],
})
export class AbcComponent implements OnInit {
    @Input() tuneBook: TuneBook;
    abcExportSettings: AbcExportSettings;
    exportedTuneBook: string;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.abcExportSettings = this.tuneBookService.getAbcExportSettings();
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.exportTuneBook(false);
    }


    exportTuneBook(startDownload:boolean) {
        let date = moment(new Date());
        this.tuneBook.version = date.format('YYYY-MM-DDTHH:mm');
        this.exportedTuneBook = this.tuneBookService.writeAbc(this.abcExportSettings);

        // Generieren Object URL zum exportierten Tunebook (fuer Backup des Abc-Codes in File)
        this.saveTuneBookAsFile(this.exportedTuneBook, startDownload);
    }

    saveTuneBookAsFile(exportedTuneBookAsText:string, startDownload:boolean) {
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {type:'text/plain'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {type:'text/plain;charset=ISO-8859-1'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {encoding:'UTF-8', type:'text/plain;charset=UTF-8'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {encoding:'ISO-8859-1', type:'text/plain;charset=ISO-8859-1'});
        let BOM = '\uFEFF';
        let data = BOM + exportedTuneBookAsText;
        let exportedTuneBookAsBlob = new Blob([data], { type: 'text/plain;charset=UTF-8' });

        let fileNameToSaveAs = 'My TuneBook';

        let downloadLink = <HTMLLinkElement>document.getElementById('saveTuneBookToFile');
        downloadLink.href = this.createObjectURL(exportedTuneBookAsBlob);
        downloadLink.title = fileNameToSaveAs;

        if (startDownload) {
            downloadLink.click();
        }
    }

    createObjectURL(file:any) {
        if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    toggleFingeringAbc() {
        this.abcExportSettings.fingering = !this.abcExportSettings.fingering;
        this.exportTuneBook(false);
    };

    toggleTuneSetAbc() {
        this.abcExportSettings.tuneSet = !this.abcExportSettings.tuneSet;
        this.exportTuneBook(false);
    };

    togglePlaylistAbc() {
        this.abcExportSettings.playlist = !this.abcExportSettings.playlist;
        this.exportTuneBook(false);
    };

    togglePlayDateAbc() {
        this.abcExportSettings.playDate = !this.abcExportSettings.playDate;
        this.exportTuneBook(false);
    };

    toggleColorAbc() {
        this.abcExportSettings.color = !this.abcExportSettings.color;
        this.exportTuneBook(false);
    };
    
    toggleAnnotationAbc() {
        this.abcExportSettings.annotation = !this.abcExportSettings.annotation;
        this.exportTuneBook(false);
    };

    toggleSiteAbc() {
        this.abcExportSettings.website = !this.abcExportSettings.website;
        this.exportTuneBook(false);
    };

    toggleTubeAbc() {
        this.abcExportSettings.video = !this.abcExportSettings.video;
        this.exportTuneBook(false);
    }

}
