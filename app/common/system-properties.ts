/// <reference path="../typings.d.ts" />

/*
export class System {
	static STORAGE_ID_TUNEBOOK: string = 'etbk-tuneBook';
    static STORAGE_ID_SETTINGS: string = 'etbk-settings';
    static VERSION: string = '1.2.4';
    static ABC_VERSION: string = '2.1';
    static DEFAULT_COLOR: string = "#F5F5F5";
    static DEFAULT_MODIFICATIONDATE_STRING: string = "1966-04-05T22:00";
    static PATTERN_FINGER: RegExp = /!\d!/g;		//matches !<number>! globally (every occurence)
    static EXAMPLE_FILENAME: string = 'Irish Tunes - Martin Fleischmann.abc';
    static EXAMPLE_FILENAME_WITHOUTABC: string = 'Irish Tunes - Martin Fleischmann';
    static EXAMPLE_VERSION: string = '2015-05-25';
    
    constructor () {
        
    }
	
	
}
*/

export function getSystemProperties(){
    return {
	   STORAGE_ID_TUNEBOOK: 'etbk-tuneBook',
       STORAGE_ID_SETTINGS: 'etbk-settings',
       VERSION: '1.2.4',
       ABC_VERSION: '2.1',
       DEFAULT_COLOR: "#F5F5F5",
       DEFAULT_MODIFICATIONDATE_STRING: "1966-04-05T22:00",
       PATTERN_FINGER: /!\d!/g,		//matches !<number>! globally (every occurence)
       EXAMPLE_FILENAME: 'Irish Tunes - Martin Fleischmann.abc',
       EXAMPLE_FILENAME_WITHOUTABC: 'Irish Tunes - Martin Fleischmann',
       EXAMPLE_VERSION: '2015-05-25',
    };
}


/*
export function SystemProperty(key){
    
}
*/