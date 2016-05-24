export function eliminateThe(string: string) {
    let theSplits: Array<string> = [];

    if (string != 'undefined' && string != null) {
        theSplits = string.split(',');
    }
    return theSplits[0];
}
