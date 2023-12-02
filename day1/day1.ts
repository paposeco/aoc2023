import fs from "fs";

const prepFile = function (file: string): string[] {
  //const fs = require("fs");
  const fileToString: string = fs.readFileSync(file).toString();
  //const calibrationvalues: string[] = fileToString.split("\n");
  const calibrationvalues: string[] = fileToString.split(/\r\n/);
  calibrationvalues.pop();
  //console.log(calibrationvalues);
  return calibrationvalues;
};

// first part
const calculateSingleCalibration = function (line: string): number {
  let lineValue: number = 0;

  let numberNumbers: number = 0;
  let numberString: string = "";

  for (let i = 0; i < line.length; i++) {
    if (!Number.isNaN(Number(line[i]))) {
      ++numberNumbers;
      numberString = numberString + line[i];
    }
  }

  if (numberNumbers === 1) {
    lineValue = Number(numberString + numberString);
  } else {
    lineValue = Number(numberString[0] + numberString[numberNumbers - 1]);
  }
  return lineValue;
};

const totalCalibrationValueFirst = function (file: string): number {
  const values: string[] = prepFile(file);
  let totalvalue: number = 0;
  values.forEach(
    (line) => (totalvalue = totalvalue + calculateSingleCalibration(line)),
  );
  return totalvalue;
};

// second part

const numberMap = new Map([
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);

const findAllOcurrencesOfWord = function (
  word: string,
  line: string,
): number[] {
  let firstOccurrence = line.indexOf(word);
  let currOccurence = firstOccurrence;
  let endFound = true;
  let lastOccurrence = currOccurence;

  while (endFound) {
    const currIndex = line.indexOf(word, currOccurence + 1);
    if (currIndex === -1) {
      endFound = false;
    }
    lastOccurrence = currOccurence;
    currOccurence = currIndex;
  }
  //console.log(firstOccurrence, lastOccurrence);
  return [firstOccurrence, lastOccurrence];
};

const calculateSingleCalibrationWithStrings = function (line: string): number {
  const possibleNumbers: string[] = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  let firstNumberStringIndex: number = line.length - 1;
  let firstNumberString: number = 0;
  let lastNumberStringIndex: number = -1;
  let lastNumberString: number = 0;
  for (let i = 0; i < possibleNumbers.length; i++) {
    if (line.includes(possibleNumbers[i])) {
      const occurrences = findAllOcurrencesOfWord(possibleNumbers[i], line);
      // first occurrence
      if (firstNumberStringIndex > occurrences[0]) {
        firstNumberStringIndex = occurrences[0];
        const numberValue = numberMap.get(possibleNumbers[i]);
        if (numberValue !== undefined) {
          firstNumberString = numberValue;
        }
      }
      if (lastNumberStringIndex < occurrences[0]) {
        lastNumberStringIndex = occurrences[0];
        const numberValue = numberMap.get(possibleNumbers[i]);
        if (numberValue !== undefined) {
          lastNumberString = numberValue;
        }
      }
      // second occurrence
      if (occurrences[1] !== -1) {
        if (firstNumberStringIndex > occurrences[1]) {
          firstNumberStringIndex = occurrences[1];
          const numberValue = numberMap.get(possibleNumbers[i]);
          if (numberValue !== undefined) {
            firstNumberString = numberValue;
          }
        }
        if (lastNumberStringIndex < occurrences[1]) {
          lastNumberStringIndex = occurrences[1];
          const numberValue = numberMap.get(possibleNumbers[i]);
          if (numberValue !== undefined) {
            lastNumberString = numberValue;
          }
        }
      }
    }
  }

  let firstNumberIndex: number = line.length - 1;
  let firstNumber: number = 0;
  let lastNumberIndex: number = -1;
  let lastNumber: number = 0;
  for (let j = 0; j < line.length; j++) {
    //  console.log(line[j]);
    if (!Number.isNaN(Number(line[j]))) {
      if (firstNumberIndex > j) {
        firstNumber = Number(line[j]);
        firstNumberIndex = j;
      }
      if (lastNumberIndex < j) {
        lastNumber = Number(line[j]);
        lastNumberIndex = j;
      }
    }
  }

  if (lastNumber === 0) {
    lastNumberIndex = -1;
  }

  if (firstNumberString === 0) {
    firstNumberStringIndex = -1;
  }

  if (firstNumber === 0) {
    firstNumberIndex = -1;
  }

  if (lastNumberString === 0) {
    lastNumberStringIndex = -1;
  }

  const indexes = [
    { index: firstNumberIndex, value: firstNumber },
    { index: firstNumberStringIndex, value: firstNumberString },
    { index: lastNumberIndex, value: lastNumber },
    { index: lastNumberStringIndex, value: lastNumberString },
  ];

  indexes.sort((a, b) => a.index - b.index);

  let value = "";
  for (let k = 0; k < indexes.length; k++) {
    if (indexes[k].index === -1) {
      continue;
    }
    if (k === indexes.length - 1) {
      value = indexes[k].value.toString() + indexes[k].value.toString();
      break;
    }
    value =
      indexes[k].value.toString() +
      indexes[indexes.length - 1].value.toString();
    break;
  }
  // console.log(value);
  return Number(value);
};

const totalCalibrationValueSecond = function (file: string): number {
  const values: string[] = prepFile(file);
  let totalvalue: number = 0;
  values.forEach((line) => {
    const lineValue = calculateSingleCalibrationWithStrings(line);
    totalvalue = totalvalue + lineValue;
  });
  return totalvalue;
};

console.log(totalCalibrationValueSecond("input.txt"));
