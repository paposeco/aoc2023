import fs from "fs";

const prepFile = function (file: string): number[][] {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  const timeString = splitLines[0];
  const distanceString = splitLines[1];
  const timeStringSplit = timeString.split(":");
  const distanceStringSplit = distanceString.split(":");
  const times = timeStringSplit[1].split(" ");
  const distances = distanceStringSplit[1].split(" ");
  let time: number[] = [];
  for (let i = 0; i < times.length; i++) {
    if (times[i] !== "") {
      time.push(Number(times[i]));
    }
  }

  let distance: number[] = [];
  for (let j = 0; j < distances.length; j++) {
    if (distances[j] !== "") {
      distance.push(Number(distances[j]));
    }
  }
  return [time, distance];
};

const calculateDistance = function (
  totaltime: number,
  buttonpressed: number,
): number {
  return totaltime * buttonpressed - buttonpressed * buttonpressed;
};

const options = function (file: string) {
  const parseFile = prepFile(file);
  const times: number[] = parseFile[0];
  const distancesToWin = parseFile[1];
  const distances: number[][] = [];
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    let currDistances: number[] = [];
    for (let j = 0; j <= time; j++) {
      currDistances.push(calculateDistance(time, j));
    }
    distances.push(currDistances);
  }

  let optionsArray: number[] = [];
  for (let k = 0; k < distancesToWin.length; k++) {
    const currDistance = distancesToWin[k];
    const distancesToCheck = distances[k];
    let numberOptions = 0;
    distancesToCheck.forEach((distance) => {
      if (distance > currDistance) {
        ++numberOptions;
      }
    });
    optionsArray.push(numberOptions);
  }
  const total = optionsArray.reduce((accum, currvalue) => accum * currvalue);
  console.log(total);
  return total;
};

// part 2

const options2 = function () {
  let distances: number[] = [];
  for (let j = 0; j <= 53837288; j++) {
    distances.push(calculateDistance(53837288, j));
  }
  let options = 0;
  for (let k = 0; k < distances.length; k++) {
    if (distances[k] > 333163512891532) {
      ++options;
    }
  }
  return options;
};

options2();
