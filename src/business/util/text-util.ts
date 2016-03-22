export function eliminateThe(string) {
    var theSplits = [];
    if (string != 'undefined' && string != null){
        theSplits = string.split(",");
    }
    return theSplits[0];
}
