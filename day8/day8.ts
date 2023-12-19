import fs from "fs";

interface Node {
  L: string;
  R: string;
}

enum Direction {
  L = "L",
  R = "R",
}

const prepFile = function (file: string): [Direction[], Map<string, Node>] {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  splitLines.pop();
  const directions: Direction[] = splitLines[0]
    .split("")
    .map((elem) => (elem === "R" ? Direction.R : Direction.L));
  const nodes: Map<string, Node> = new Map();
  for (let i = 2; i < splitLines.length; i++) {
    const currLine = splitLines[i].split(" ");
    let newLine: string[] = [];
    currLine.forEach((elem) => {
      newLine.push(
        elem
          .replace("=", "")
          .replace(",", "")
          .replace(")", "")
          .replace("(", "")
          .trim(),
      );
    });
    nodes.set(newLine[0], { L: newLine[2], R: newLine[3] });
  }
  return [directions, nodes];
};

// part 1

const followDirections = function (file: string) {
  const data = prepFile(file);
  const directions: Direction[] = data[0];
  const nodes = data[1];

  let ZZZfound = false;
  let steps = 0;
  let currDirectionIndex = 0;
  let currentNode = "";
  while (!ZZZfound) {
    if (currDirectionIndex === directions.length) {
      currDirectionIndex = 0;
    }
    if (steps === 0) {
      const startingpoint = nodes.get("AAA");
      if (startingpoint !== undefined) {
        const direction: Direction = directions[currDirectionIndex];
        currentNode = startingpoint[direction];
        ++steps;
        ++currDirectionIndex;
      }
    } else {
      const currNode = nodes.get(currentNode);
      if (currNode !== undefined) {
        const direction: Direction = directions[currDirectionIndex];
        currentNode = currNode[direction];
        ++steps;
        ++currDirectionIndex;
      }
    }
    if (currentNode === "ZZZ") {
      ZZZfound = true;
    }
  }
  return steps;
};

// part 2

// run for each node and see whats the minimun number of steps

const findNodesThatEndWithA = function (nodes: Map<string, Node>) {
  let nodesFound: string[] = [];
  const iterator1 = nodes[Symbol.iterator]();

  for (const item of iterator1) {
    if (item[0][2] === "A") {
      nodesFound.push(item[0]);
    }
  }
  return nodesFound;
};

const followDirectionsMutiple = function (file: string) {
  const data = prepFile(file);
  const directions: Direction[] = data[0];
  const nodes = data[1];
  const startingNodes = findNodesThatEndWithA(nodes);
  let allsteps: number[] = [];

  startingNodes.forEach((node) => {
    let found = false;
    let steps = 0;
    let currDirectionIndex = 0;
    let currNode = node;
    while (!found) {
      if (currDirectionIndex === directions.length) {
        currDirectionIndex = 0;
      }
      const followpath = followPath(
        currNode,
        directions[currDirectionIndex],
        nodes,
      );
      found = followpath[0];
      currNode = followpath[1];
      if (found) {
      }

      ++steps;
      ++currDirectionIndex;
    }
    allsteps.push(steps);
  });
  return allsteps;
};

const followPath = function (
  startingNode: string,
  direction: Direction,
  nodes: Map<string, Node>,
): [boolean, string] {
  const nodeContent = nodes.get(startingNode);
  if (nodeContent !== undefined) {
    const endswithZ = nodeContent[direction][2] === "Z" ? true : false;
    return [endswithZ, nodeContent[direction]];
  }
  console.log("ABORT");
  return [false, ""];
};

// greatest common denominator

const gcd = function (a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
};

// least common multiple

const lcm = function (a: number, b: number): number {
  return (a / gcd(a, b)) * b;
};

// calculate all the paths and find common denominator

const calculateFinalSteps = function (file: string) {
  const allpaths = followDirectionsMutiple(file).sort();
  const calculateLCMForAllSteps = allpaths.reduce(
    (accum, curr) => (accum = lcm(accum, curr)),
  );
  console.log(calculateLCMForAllSteps);
  return calculateLCMForAllSteps;
};

calculateFinalSteps("input.txt");
