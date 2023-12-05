import fs from "fs";

interface Range {
  destination: number;
  sourceMin: number;
  sourceMax: number;
}

interface Category {
  name: string;
  ranges: Range[];
}

const prepFile = function (file: string): [number[], Category[]] {
  const fileToString: string = fs.readFileSync(file).toString();
  const seedSoilIndex = fileToString.indexOf("seed-to-soil");
  const soilFertilizerIndex = fileToString.indexOf("soil-to-fertilizer");
  const fertilizerWaterIndex = fileToString.indexOf("fertilizer-to-water");
  const waterLightIndex = fileToString.indexOf("water-to-light");
  const lightTemperatureIndex = fileToString.indexOf("light-to-temperature");
  const temperatureHumidityIndex = fileToString.indexOf(
    "temperature-to-humidity",
  );
  const humidityLocationIndex = fileToString.indexOf("humidity-to-location");

  const seedsString = fileToString
    .substring(0, seedSoilIndex)
    .trimEnd()
    .split(": ");
  const seedSoilString = fileToString
    .substring(seedSoilIndex, soilFertilizerIndex)
    .trimEnd()
    .split(/\n/);
  const soilFertilizerString = fileToString
    .substring(soilFertilizerIndex, fertilizerWaterIndex)
    .trimEnd()
    .split(/\n/);
  const fertilizerWaterString = fileToString
    .substring(fertilizerWaterIndex, waterLightIndex)
    .trimEnd()
    .split(/\n/);
  const waterLightString = fileToString
    .substring(waterLightIndex, lightTemperatureIndex)
    .trimEnd()
    .split(/\n/);
  const lightTemperatureString = fileToString
    .substring(lightTemperatureIndex, temperatureHumidityIndex)
    .trimEnd()
    .split(/\n/);
  const temperatureHumidityString = fileToString
    .substring(temperatureHumidityIndex, humidityLocationIndex)
    .trimEnd()
    .split(/\n/);
  const humidityLocationString = fileToString
    .substring(humidityLocationIndex)
    .trimEnd()
    .split(/\n/);

  const almanac = [
    seedSoilString,
    soilFertilizerString,
    fertilizerWaterString,
    waterLightString,
    lightTemperatureString,
    temperatureHumidityString,
    humidityLocationString,
  ];
  const seeds = seedsString[1].split(" ").map((x) => Number(x));
  let organizedAlmanac: Category[] = [];
  almanac.forEach((category) => {
    const mapString = category[0].indexOf(" map:");
    let rangesCollection: Range[] = [];
    for (let i = 1; i < category.length; i++) {
      const categoryObj: Range = { destination: 0, sourceMin: 0, sourceMax: 0 };
      const currentString = category[i];
      const stringNumbers = currentString.split(" ").map((x) => Number(x));
      categoryObj.destination = stringNumbers[0];
      categoryObj.sourceMin = stringNumbers[1];
      categoryObj.sourceMax = stringNumbers[1] + stringNumbers[2] - 1;
      rangesCollection.push(categoryObj);
    }
    organizedAlmanac.push({
      name: category[0].substring(0, mapString),
      ranges: rangesCollection,
    });
  });
  return [seeds, organizedAlmanac];
};

const checkIfSeedIsInsideRange = function (
  startingpoint: number,
  range: Range,
) {
  let nextNumber = 0;
  if (startingpoint <= range.sourceMax && startingpoint >= range.sourceMin) {
    nextNumber = range.destination + (startingpoint - range.sourceMin);
  } else {
    nextNumber = startingpoint;
  }
  return nextNumber;
};

const findLowestLocations = function (file: string) {
  const parseFile = prepFile(file);
  const seeds: number[] = parseFile[0];
  const almanac: Category[] = parseFile[1];
  let location: number = 0;
  for (let i = 0; i < seeds.length; i++) {
    let seed = seeds[i];
    for (let j = 0; j < almanac.length; j++) {
      for (let k = 0; k < almanac[j].ranges.length; k++) {
        const findNextNumber = checkIfSeedIsInsideRange(
          seed,
          almanac[j].ranges[k],
        );
        if (findNextNumber !== seed) {
          seed = findNextNumber;
          break;
        } else {
          seed = findNextNumber;
        }
        seed = findNextNumber;
      }
    }
    if (location === 0) {
      location = seed;
    } else if (location > seed) {
      location = seed;
    }
  }
  return location;
};

//console.log(findLowestLocations("input.txt"));

// part 2

interface SeedPair {
  startingseed: number;
  numberofseeds: number;
}

const createSeeds = function (seeds: number[]) {
  let array: SeedPair[] = [];
  for (let i = 0; i < seeds.length; i++) {
    const seedPair = { startingseed: seeds[i], numberofseeds: seeds[i + 1] };
    array.push(seedPair);
    ++i;
  }
  return array;
};

const findLocations = function (file: string) {
  const parseFile = prepFile(file);
  const seeds: number[] = parseFile[0];
  const pairsOfSeeds = createSeeds(seeds);
  const almanac: Category[] = parseFile[1];
  let location = 0;
  for (let i = 0; i < pairsOfSeeds.length; i++) {
    const currentSeedPair = pairsOfSeeds[i];
    console.log(currentSeedPair);
    for (
      let m = currentSeedPair.startingseed;
      m < currentSeedPair.startingseed + currentSeedPair.numberofseeds;
      m++
    ) {
      // console.log(m);
      let seed = m;
      for (let j = 0; j < almanac.length; j++) {
        for (let k = 0; k < almanac[j].ranges.length; k++) {
          const findNextNumber = checkIfSeedIsInsideRange(
            seed,
            almanac[j].ranges[k],
          );
          if (findNextNumber !== seed) {
            seed = findNextNumber;
            break;
          } else {
            seed = findNextNumber;
          }
          seed = findNextNumber;
        }
      }
      if (location === 0) {
        location = seed;
      } else if (location > seed) {
        location = seed;
      }
    }
  }
  return location;
};

console.log(findLocations("input.txt"));
