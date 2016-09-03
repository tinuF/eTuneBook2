import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';

import * as moment from 'moment';

import { TuneBookService, TuneBook, AbcExportSettings } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-abc',
    templateUrl: 'abc.component.html',
    styleUrls: ['abc.component.css'],
})
export class AbcComponent implements OnInit, AfterViewInit {
    tuneBook: TuneBook;
    isRendering: boolean;
    @ViewChild('saveTuneBookToFile') saveTuneBookToFile: ElementRef;
    abcExportSettings: AbcExportSettings;
    exportedTuneBook: string;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer, private cdr: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.isRendering = true;
        this.tuneBookService.isRendering();
        this.abcExportSettings = this.tuneBookService.getAbcExportSettings();
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.exportTuneBook();
    }

    ngAfterViewInit() {
        this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        this.tuneBookService.isRendered();
        //console.log('abc:ngAfterViewInit called');
    }


    exportTuneBook() {
        let date = moment(new Date());
        this.tuneBook.version = date.format('YYYY-MM-DDTHH:mm');
        this.exportedTuneBook = this.tuneBookService.writeAbc(this.abcExportSettings);

        // Generieren Object URL zum exportierten Tunebook (fuer Backup des Abc-Codes in File)
        this.saveTuneBookAsFile(this.exportedTuneBook);
    }

    saveTuneBookAsFile(exportedTuneBookAsText: string) {
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {type:'text/plain'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {type:'text/plain;charset=ISO-8859-1'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {encoding:'UTF-8', type:'text/plain;charset=UTF-8'});
        //let exportedTuneBookAsBlob = new Blob([exportedTuneBookAsText], {encoding:'ISO-8859-1', type:'text/plain;charset=ISO-8859-1'});
        let BOM = '\uFEFF';
        let data = BOM + exportedTuneBookAsText;
        let exportedTuneBookAsBlob = new Blob([data], { type: 'text/plain;charset=UTF-8' });

        let fileNameToSaveAs = 'My TuneBook';

        this.renderer.setElementProperty(this.saveTuneBookToFile.nativeElement, 'href', this.createObjectURL(exportedTuneBookAsBlob));
        this.renderer.setElementProperty(this.saveTuneBookToFile.nativeElement, 'title', fileNameToSaveAs);
    }

    createObjectURL(file: any) {
        if (window.URL && window.URL.createObjectURL) {
            return window.URL.createObjectURL(file);
        } else {
            return null;
        }
    }

    toggleFingeringAbc() {
        this.abcExportSettings.fingering = !this.abcExportSettings.fingering;
        this.exportTuneBook();
    };

    toggleTuneSetAbc() {
        this.abcExportSettings.tuneSet = !this.abcExportSettings.tuneSet;
        this.exportTuneBook();
    };

    togglePlaylistAbc() {
        this.abcExportSettings.playlist = !this.abcExportSettings.playlist;
        this.exportTuneBook();
    };

    togglePlayDateAbc() {
        this.abcExportSettings.playDate = !this.abcExportSettings.playDate;
        this.exportTuneBook();
    };

    toggleColorAbc() {
        this.abcExportSettings.color = !this.abcExportSettings.color;
        this.exportTuneBook();
    };

    toggleAnnotationAbc() {
        this.abcExportSettings.annotation = !this.abcExportSettings.annotation;
        this.exportTuneBook();
    };

    toggleSiteAbc() {
        this.abcExportSettings.website = !this.abcExportSettings.website;
        this.exportTuneBook();
    };

    toggleTubeAbc() {
        this.abcExportSettings.video = !this.abcExportSettings.video;
        this.exportTuneBook();
    }
}
