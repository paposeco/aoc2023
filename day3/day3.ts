import fs from "fs";

const prepFile = function (file: string) {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  splitLines.pop();
  // console.log(splitLines);
  return splitLines;
};

const findSymbols = function (lines: string[]): Map<number, number[]> {
  const symbolMap = new Map<number, number[]>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      // is symbol
      if (char !== "." && Number.isNaN(Number(char))) {
        if (symbolMap.has(i)) {
          const currCoords = symbolMap.get(i);
          if (currCoords !== undefined) {
            currCoords.push(j);
            symbolMap.set(i, currCoords);
          }
        } else {
          symbolMap.set(i, [j]);
        }
      }
    }
  }
  return symbolMap;
};

const checkSymbolLocation = function (
  currnumber: string,
  numberYindex: number,
  symbolYIndexes: number[],
  symbolLineLocation: string,
): boolean {
  const numberlength = currnumber.length;
  if (symbolLineLocation === "top" || symbolLineLocation === "under") {
    //check at left most diagonal, above number and right most diagonal
    if (symbolYIndexes.includes(numberYindex - 1)) {
      return true;
    } else if (symbolYIndexes.includes(numberYindex + numberlength)) {
      return true;
    } else {
      let hasSymbol = false;
      for (let i = 0; i < numberlength; i++) {
        if (symbolYIndexes.includes(numberYindex + i)) {
          hasSymbol = true;
          break;
        }
      }
      return hasSymbol;
    }
  } else if (symbolLineLocation === "same") {
    // check left and right
    if (symbolYIndexes.includes(numberYindex - 1)) {
      return true;
    } else if (symbolYIndexes.includes(numberYindex + numberlength)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const countParts = function (file: string) {
  const lines = prepFile(file);
  const symbolMap = findSymbols(lines);
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.search(/\d/) === -1) {
      continue;
    }
    if (!symbolMap.has(i) && !symbolMap.has(i - 1) && !symbolMap.has(i + 1)) {
      //there are not symbols above, below or on the same line
      continue;
    }
    const symbolLineTop = symbolMap.get(i - 1);
    const symbolSameLine = symbolMap.get(i);
    const symbolLineUnder = symbolMap.get(i + 1);
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      // is number
      if (char !== "." && !Number.isNaN(Number(char))) {
        const shortenedLine = line.substring(j + 1);
        const nextNonDigit = shortenedLine.search(/\D/);
        let fullNumber = "";

        if (nextNonDigit === -1) {
          fullNumber = line.substring(j, line.length);

          let symbolExists = false;
          if (symbolSameLine !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              j,
              symbolSameLine,
              "same",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
          if (symbolLineTop !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              j,
              symbolLineTop,
              "top",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
          if (symbolLineUnder !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              j,
              symbolLineUnder,
              "under",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
          break;
        } else {
          fullNumber = line.substring(j, nextNonDigit + j + 1);
          const currj = j;
          j += nextNonDigit + 1;
          let symbolExists = false;
          if (symbolSameLine !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              currj,
              symbolSameLine,
              "same",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
          if (symbolLineTop !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              currj,
              symbolLineTop,
              "top",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
          if (symbolLineUnder !== undefined) {
            symbolExists = checkSymbolLocation(
              fullNumber,
              currj,
              symbolLineUnder,
              "under",
            );
            if (symbolExists) {
              sum += Number(fullNumber);
              continue;
            }
          }
        }
      }
    }
  }
  console.log(sum);
  return sum;
};

// part 2

const checkForNumbers = function (
  currline: string,
  lineabove: string,
  linebelow: string,
  j: number,
) {
  // same line
  const charNW = lineabove[j - 1];
  const charN = lineabove[j];
  const charNE = lineabove[j + 1];
  const charW = currline[j - 1];
  const charE = currline[j + 1];
  const charSW = linebelow[j - 1];
  const charS = linebelow[j];
  const charSE = linebelow[j + 1];
  let gears: number[] = [];

  // top line
  // NW is a number
  if (!Number.isNaN(Number(charNW))) {
    //check where number starts and ends
    // NW
    // next position
    if (Number.isNaN(Number(charN))) {
      // not a number, check previous char
      if (Number.isNaN(Number(lineabove[j - 2]))) {
        // not a number
        gears.push(Number(charNW));
      } else {
        // previous is a number
        if (Number.isNaN(Number(lineabove[j - 3]))) {
          // this is isnt
          gears.push(Number(lineabove[j - 2] + charNW));
        } else {
          gears.push(Number(lineabove[j - 3] + lineabove[j - 2] + charNW));
        }
      }
      if (!Number.isNaN(Number(charNE))) {
        if (Number.isNaN(Number(lineabove[j + 2]))) {
          gears.push(Number(charNE));
        } else {
          if (Number.isNaN(Number(lineabove[j + 3]))) {
            gears.push(Number(charNE + lineabove[j + 2]));
          } else {
            gears.push(Number(charNE + lineabove[j + 2] + lineabove[j + 3]));
          }
        }
      }
    } else {
      // N is a number
      if (Number.isNaN(Number(charNE))) {
        // ne not a number
        if (Number.isNaN(Number(lineabove[j - 2]))) {
          gears.push(Number(charNW + charN));
        } else {
          gears.push(Number(lineabove[j - 2] + charNW + charN));
        }
      } else {
        gears.push(Number(charNW + charN + charNE));
        // not need to continue because numbers are 3 algorithms at most
      }
    }
  } else {
    // nw not number, but n is
    if (!Number.isNaN(Number(charN))) {
      if (Number.isNaN(Number(charNE))) {
        // NE not a number
        gears.push(Number(charN));
      } else {
        // and ne is a number
        if (Number.isNaN(Number(lineabove[j + 2]))) {
          gears.push(Number(charN + charNE));
        } else {
          gears.push(Number(charN + charNE + lineabove[j + 2]));
        }
      }
    } else {
      if (!Number.isNaN(Number(charNE))) {
        // NW and N are not numbers but NE is
        if (Number.isNaN(Number(lineabove[j + 2]))) {
          gears.push(Number(charNE));
        } else {
          if (Number.isNaN(Number(lineabove[j + 3]))) {
            gears.push(Number(charNE + lineabove[j + 2]));
          } else {
            gears.push(Number(charNE + lineabove[j + 2] + lineabove[j + 3]));
          }
        }
      }
    }
  }

  // middle line
  if (!Number.isNaN(Number(charW))) {
    if (Number.isNaN(Number(currline[j - 2]))) {
      gears.push(Number(charW));
    } else {
      if (Number.isNaN(Number(currline[j - 3]))) {
        gears.push(Number(currline[j - 2] + charW));
      } else {
        gears.push(Number(currline[j - 3] + currline[j - 2] + charW));
      }
    }
  }
  if (!Number.isNaN(Number(charE))) {
    if (Number.isNaN(Number(currline[j + 2]))) {
      gears.push(Number(charE));
    } else {
      if (Number.isNaN(Number(currline[j + 3]))) {
        gears.push(Number(charE + currline[j + 2]));
      } else {
        gears.push(Number(charE + currline[j + 2] + currline[j + 3]));
      }
    }
  }

  // bottom line
  // SW is a number
  if (!Number.isNaN(Number(charSW))) {
    //check where number starts and ends
    // NW
    // next position
    if (Number.isNaN(Number(charS))) {
      // not a number, check previous char
      if (Number.isNaN(Number(linebelow[j - 2]))) {
        // not a number
        gears.push(Number(charSW));
      } else {
        // previous is a number
        if (Number.isNaN(Number(linebelow[j - 3]))) {
          // this is isnt
          gears.push(Number(linebelow[j - 2] + charSW));
        } else {
          gears.push(Number(linebelow[j - 3] + linebelow[j - 2] + charSW));
        }
      }
      if (!Number.isNaN(Number(charSE))) {
        if (Number.isNaN(Number(linebelow[j + 2]))) {
          gears.push(Number(charSE));
        } else {
          if (Number.isNaN(Number(linebelow[j + 3]))) {
            gears.push(Number(charSE + linebelow[j + 2]));
          } else {
            gears.push(Number(charSE + linebelow[j + 2] + linebelow[j + 3]));
          }
        }
      }
    } else {
      // N is a number
      if (Number.isNaN(Number(charSE))) {
        // ne not a number
        if (Number.isNaN(Number(linebelow[j - 2]))) {
          gears.push(Number(charSW + charS));
        } else {
          gears.push(Number(linebelow[j - 2] + charSW + charS));
        }
      } else {
        gears.push(Number(charSW + charS + charSE));

        // not need to continue because numbers are 3 algorithms at most
      }
    }
  } else {
    // nw not number, but n is
    if (!Number.isNaN(Number(charS))) {
      if (Number.isNaN(Number(charSE))) {
        // NE not a number
        gears.push(Number(charS));
      } else {
        // and ne is a number
        if (Number.isNaN(Number(linebelow[j + 2]))) {
          gears.push(Number(charS + charSE));
        } else {
          gears.push(Number(charS + charSE + linebelow[j + 2]));
        }
      }
    } else {
      if (!Number.isNaN(Number(charSE))) {
        // NW and N are not numbers but NE is
        if (Number.isNaN(Number(linebelow[j + 2]))) {
          gears.push(Number(charSE));
        } else {
          if (Number.isNaN(Number(linebelow[j + 3]))) {
            gears.push(Number(charSE + linebelow[j + 2]));
          } else {
            gears.push(Number(charSE + linebelow[j + 2] + linebelow[j + 3]));
          }
        }
      }
    }
  }

  return gears;
};

const countGears = function (file: string) {
  const lines = prepFile(file);
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "*") {
        // check if there are two numbers adjacent
        const gearsforline = checkForNumbers(
          line,
          lines[i - 1],
          lines[i + 1],
          j,
        );
        if (gearsforline.length === 2) {
          sum += gearsforline[0] * gearsforline[1];
        }
      }
    }
  }
  console.log(sum);
  return sum;
};

countGears("input.txt");
