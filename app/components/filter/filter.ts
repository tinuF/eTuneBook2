/// <reference path="../../typings.d.ts" />
import {Component, CORE_DIRECTIVES,  EventEmitter, OnInit} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';

import {FilterSettings} from '../../common/settings/filter-settings';



@Component({
    selector: 'etbk-filter', //ACHTUNG: filter kollidiert mit svg filter element, deshalb ist etbk- wichtig!
    templateUrl: './components/filter/filter.html',
    styleUrls: ['./components/filter/filter.css'],
    directives: [CORE_DIRECTIVES]
})
export class FilterUI {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;
    systemProperties;
    currentFilter: string;
    filterActive: boolean;
    tuneSetPlayRangeFilter;
    ranges;
    tuneSetUpdateRangeFilter;
    type;
    types;
    key;
    keys;
    freqencyComparator;
    tuneSetFrequencyForFilter;
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
    
    onInit() {
        this.setFilterOptions();
        this.setSelectedType(this.filterSettings.type);
        this.setSelectedKey(this.filterSettings.key);
        this.setSelectedColor(this.filterSettings.color);
        this.setSelectedEvent(this.filterSettings.event);
        this.setSelectedBand(this.filterSettings.band);

        // Set which Play Range to Filter
        // Default: Launch Date of eTuneBook till now
        this.tuneSetPlayRangeFilter = {
            startDate: moment('05.10.2012', 'DD.MM.YYYY'),
            endDate: moment()
        };

        var playMin = this.filterSettings.plmin;
        if (playMin != null) {
            this.tuneSetPlayRangeFilter.startDate = moment(playMin, 'DD.MM.YYYY');
        }
        var playMax = this.filterSettings.plmax;
        if (playMax != null) {
            this.tuneSetPlayRangeFilter.endDate = moment(playMax, 'DD.MM.YYYY');
        }

        // Set which Update Range to Filter
        // Default: Launch Date of eTuneBook till now
        this.tuneSetUpdateRangeFilter = {
            startDate: moment('05.10.2012', 'DD.MM.YYYY'),
            endDate: moment()
        };

        var updateMin = this.filterSettings.updmin;
        if (updateMin != null) {
            this.tuneSetUpdateRangeFilter.startDate = moment(updateMin, 'DD.MM.YYYY');
        }
        var updateMax = this.filterSettings.updmax;
        if (updateMax != null) {
            this.tuneSetUpdateRangeFilter.endDate = moment(updateMax, 'DD.MM.YYYY');
        }

        this.ranges = {
            'Today': [moment().startOf('day'), moment().add(1, 'days')],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(7, 'days'), moment()],
            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment()],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Maximum Range': [moment('05.10.2012', 'DD.MM.YYYY'), moment()]
        };


        // Set which Frequency Range to Filter
        var freqComp = this.filterSettings.freqcomp;
        if (freqComp == null) {
            freqComp = "";
        }
        var freq = this.filterSettings.freq;
        if (freq == null) {
            freq = "";
        }

        this.freqencyComparator = freqComp;
        this.tuneSetFrequencyForFilter = freq;

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
    
    /*
    applyFilter() {

        this.filterSettings.plmin = this.tuneSetPlayRangeFilter.startDate.format('DD.MM.YYYY');
        this.filterSettings.plmax = this.tuneSetPlayRangeFilter.endDate.format('DD.MM.YYYY');
        this.filterSettings.updmin = this.tuneSetUpdateRangeFilter.startDate.format('DD.MM.YYYY');
        this.filterSettings.updmax = this.tuneSetUpdateRangeFilter.endDate.format('DD.MM.YYYY');
        this.filterSettings.freqcomp = this.freqencyComparator;
        this.filterSettings.freq = this.tuneSetFrequencyForFilter;
        
        // Emitt Event to Parent
        
        this.filterChange.next({
            value: this.filterSettings
        });
        
    }
    */
        
    setType(event) {
        this.type = event.target.value;
        this.filterSettings.setType(this.type);
        this.applyFilter();
    }
    
    setKey(event) {
        this.key = event.target.value;
        this.filterSettings.setKey(this.key);
        this.applyFilter();
    }
    
    setColor(event) {
        this.color = event.target.value;
        this.filterSettings.setColor(this.color);
        this.applyFilter();
    }
    
    setEvent(event) {
        this.event = event.target.value;
        this.filterSettings.setEvent(this.event);
        this.applyFilter();
    }
    
    setBand(event) {
        this.band = event.target.value;
        this.filterSettings.setBand(this.band);
        this.applyFilter();
    }
    
    applyFilter() {
        //this is to tell tunelist to update (via bindings)
        //this works. however compare search in app.ts which is broken in alpha.36
        this.tuneBookService.applyFilter();
    }
}
