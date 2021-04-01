let wordsToArray = function (words) {
  if (!words.length) {
    return [];
  }
  return words.split(",").map((word) => word.trim().toUpperCase());
};

module.exports = wordsToArray;
