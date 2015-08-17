export function getAbcValue(abc, abcField, initValue){
  var value = initValue;
  var abcFieldSplits = [];
  abcFieldSplits = abc.split(abcField);
  if  (abcFieldSplits.length > 1){
    abcFieldSplits = abcFieldSplits[1].split("\n");
    value = abcFieldSplits[0].replace(/^\s+|\s+$/g, '');
  }
  return value;
}



export function getAbcValues(abc, abcField){
  var values = [];
  var value = "";
  var abcFieldSplits = [];
  var lineSplits = [];

  abcFieldSplits = abc.split(abcField);

  for (var i = 0; i < abcFieldSplits.length; i++) {
    if  (i > 0){
      lineSplits = abcFieldSplits[i].split("\n");
      value = lineSplits[0].replace(/^\s+|\s+$/g, '');
      values.push(value);
    }
  }
  return values;
}

export function getAbcValueOfTuneLine(tuneLine, abcField, initValue){
  var value = initValue;
  var abcFieldSplits = [];
  abcFieldSplits = tuneLine.split(abcField);
  if  (abcFieldSplits.length > 1){
    abcFieldSplits = abcFieldSplits[1].split("\n");
    value = abcFieldSplits[0].replace(/^\s+|\s+$/g, '');
  }
  return value;
}

export function getSubDirective(directive, beginAfter, endBefore){
    var detail = "";
    var detailSplits = directive.split(beginAfter);

    if  (detailSplits.length > 1){
        detailSplits = detailSplits[1].split(endBefore);
        detail = detailSplits[0].replace(/^\s+|\s+$/g, '');
    }
    return detail;
}
