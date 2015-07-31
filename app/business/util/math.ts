export function getRandomArrayIndex(array){
  // Get a random number between 1 and the number of array elements
  return Math.floor(Math.random()* array.length) + 1;
}
