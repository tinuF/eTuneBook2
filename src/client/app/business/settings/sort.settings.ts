export class SortSettings {
    tuneListSort: string;
    tuneListAscending: boolean;
    tuneSetListSort: string;
    tuneSetListAscending: boolean;

    constructor() {
        this.tuneListSort = '';  //tuneList gets sorted in tune-list-menu.component.ts
        this.tuneListAscending = true;
        this.tuneSetListSort = 'id'; //tuneSetList is already sorted
        this.tuneSetListAscending = true;
    }

    isTuneListAscending() {
        return this.tuneListAscending;
    }

    setTuneListAscending(ascending: boolean) {
        this.tuneListAscending = ascending;
    }

    getTuneListSort() {
        return this.tuneListSort;
    }

    setTuneListSort(sorting: string) {
        this.tuneListSort = sorting;
    }

    isTuneSetListAscending() {
        return this.tuneSetListAscending;
    }

    setTuneSetListAscending(ascending: boolean) {
        this.tuneSetListAscending = ascending;
    }

    getTuneSetListSort() {
        return this.tuneSetListSort;
    }

    setTuneSetListSort(sorting: string) {
        this.tuneSetListSort = sorting;
    }
}
