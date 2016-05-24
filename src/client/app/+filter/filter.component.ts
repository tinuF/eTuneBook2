import { Component, OnInit } from '@angular/core';

import { TuneBookService, TuneBook, getSystemProperties, FilterSettings } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-filter', //ACHTUNG: filter kollidiert mit svg filter element, deshalb ist etbk- wichtig!
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.css']
})
export class FilterComponent implements OnInit {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;
    systemProperties;
    currentFilter: string;
    filterActive: boolean;
    type;
    types;
    key;
    keys;
    event;
    events;
    band;
    bands;
    color;
    colors;

    constructor(public tuneBookService: TuneBookService) {
        this.systemProperties = getSystemProperties();
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    ngOnInit() {
        this.setFilterOptions();
        this.setSelectedType(this.filterSettings.type);
        this.setSelectedKey(this.filterSettings.key);
        this.setSelectedColor(this.filterSettings.color);
        this.setSelectedEvent(this.filterSettings.event);
        this.setSelectedBand(this.filterSettings.band);
    }

    setSelectedType(type) {
        for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] == type) {
                // Setzen neuer Filter
                this.type = this.types[i];
            }
        }
    }

    setSelectedKey(key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] == key) {
                // Setzen neuer Filter
                this.key = this.keys[i];
            }
        }
    }

    setSelectedEvent(event) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i] == event) {
                // Setzen neuer Filter
                this.event = this.events[i];
            }
        }
    }

    setSelectedBand(band) {
        for (var i = 0; i < this.bands.length; i++) {
            if (this.bands[i] == band) {
                // Setzen neuer Filter
                this.band = this.bands[i];
            }
        }
    }

    setSelectedColor(color) {
        for (var i = 0; i < this.colors.length; i++) {
            if (this.colors[i] == color) {
                // Setzen neuer Filter
                this.color = this.colors[i];
            }
        }
    }

    setTypes() {
        this.types = this.tuneBook.getTuneTypes();
    }

    setKeys() {
        this.keys = this.tuneBook.getKeys();
    }

    setEvents() {
        this.events = this.tuneBook.getEvents();
    }

    setBands() {
        this.bands = this.tuneBook.getBands();
    }

    setColors() {
        this.colors = this.tuneBook.getColors();
    }

    setFilterOptions() {
        this.setTypes();
        this.setKeys();
        this.setColors();
        this.setEvents();
        this.setBands();
    }

    setType(e) {
        this.type = e.target.value;
        this.filterSettings.setType(this.type);
        this.applyFilter();
    }

    setKey(e) {
        this.key = e.target.value;
        this.filterSettings.setKey(this.key);
        this.applyFilter();
    }

    setColor(e) {
        this.color = e.target.value;
        //e.target.style.background = this.color;
        this.filterSettings.setColor(this.color);
        this.applyFilter();
    }

    setEvent(e) {
        this.event = e.target.value;
        this.filterSettings.setEvent(this.event);
        this.applyFilter();
    }

    setBand(e) {
        this.band = e.target.value;
        this.filterSettings.setBand(this.band);
        this.applyFilter();
    }

    applyFilter() {
        this.tuneBookService.applyFilter();
    }
}
