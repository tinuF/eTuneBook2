export function getRandomArrayIndex(array) {
    // Get a random number between 1 and the number of array elements
    return Math.floor(Math.random() * array.length) + 1;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
