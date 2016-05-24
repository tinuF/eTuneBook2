export function getAbcValue(abc: string, abcField: string, initValue: string) {
    let value = initValue;
    let abcFieldSplits: Array<string> = [];

    abcFieldSplits = abc.split(abcField);

    if (abcFieldSplits.length > 1) {
        abcFieldSplits = abcFieldSplits[1].split('\n');
        value = abcFieldSplits[0].replace(/^\s+|\s+$/g, '');
    }
    return value;
}



export function getAbcValues(abc: string, abcField: string) {
    let values: Array<string> = [];
    let value = '';
    let abcFieldSplits: Array<string> = [];
    let lineSplits: Array<string> = [];

    abcFieldSplits = abc.split(abcField);

    for (let i = 0; i < abcFieldSplits.length; i++) {
        if (i > 0) {
            lineSplits = abcFieldSplits[i].split('\n');
            value = lineSplits[0].replace(/^\s+|\s+$/g, '');
            values.push(value);
        }
    }
    return values;
}

export function getAbcValueOfTuneLine(tuneLine: string, abcField: string, initValue: string) {
    let value = initValue;
    let abcFieldSplits: Array<string> = [];

    abcFieldSplits = tuneLine.split(abcField);

    if (abcFieldSplits.length > 1) {
        abcFieldSplits = abcFieldSplits[1].split('\n');
        value = abcFieldSplits[0].replace(/^\s+|\s+$/g, '');
    }
    return value;
}

export function getSubDirective(directive: string, beginAfter: string, endBefore: string) {
    let detail = '';
    let detailSplits = directive.split(beginAfter);

    if (detailSplits.length > 1) {
        detailSplits = detailSplits[1].split(endBefore);
        detail = detailSplits[0].replace(/^\s+|\s+$/g, '');
    }
    return detail;
}
