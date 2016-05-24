export class PlaylistSettings {
    showDots: boolean;
    numberOfBars: string;

    constructor() {
        this.showDots = false;
        this.numberOfBars = '*';
    }

    isShowDots() {
        return this.showDots;
    }

    setShowDots(showDots: boolean) {
        this.showDots = showDots;
    }

    toggleShowDots() {
        this.showDots = !this.showDots;
    }

    setNumberOfBars(numberOfBars: string) {
        this.numberOfBars = numberOfBars;
    }

    getNumberOfBars() {
        return this.numberOfBars;
    }
}
