import fs from "fs";

enum HandType {
  fivekind = "fivekind",
  fourkind = "fourkind",
  full = "full",
  three = "three",
  twopair = "twopair",
  onepair = "onepair",
  highcard = "highcard",
}

interface Hand {
  hand: string;
  orderedhand: (string | number)[];
  bid: number;
  handtype?: HandType;
}

const prepFile = function (file: string): Hand[] {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  splitLines.pop();
  let hands: Hand[] = [];
  splitLines.forEach((hand) => {
    const splitline = hand.split(" ");
    hands.push({
      hand: splitline[0],
      orderedhand: splitline[0]
        .split("")
        .map((card) => (!Number.isNaN(Number(card)) ? Number(card) : card))
        .map((card) => (card === "J" ? (card = "S") : card)) // so that the letters get sorted
        .sort(),
      bid: Number(splitline[1]),
    });
  });
  return hands;
};

const orderTypes = function (hands: Hand[]) {
  const fivekind: Hand[] = [];
  const fourkind: Hand[] = [];
  const full: Hand[] = [];
  const three: Hand[] = [];
  const twopair: Hand[] = [];
  const onepair: Hand[] = [];
  const highcard: Hand[] = [];
  hands.forEach((hand) => {
    switch (hand.handtype) {
      case "fivekind":
        fivekind.push(hand);
        break;
      case "fourkind":
        fourkind.push(hand);
        break;
      case "full":
        full.push(hand);
        break;
      case "three":
        three.push(hand);
        break;
      case "twopair":
        twopair.push(hand);
        break;
      case "onepair":
        onepair.push(hand);
        break;
      case "highcard":
        highcard.push(hand);
      default:
        break;
    }
  });
  return [highcard, onepair, twopair, three, full, fourkind, fivekind];
};
// part 1
// const cardRank: Map<string | number, number> = new Map([
//   ["A", 0],
//   ["K", 1],
//   ["Q", 2],
//   ["J", 3],
//   ["T", 4],
//   ["9", 5],
//   ["8", 6],
//   ["7", 7],
//   ["6", 8],
//   ["5", 9],
//   ["4", 10],
//   ["3", 11],
//   ["2", 12],
// ]);

//part 2

const cardRank: Map<string | number, number> = new Map([
  ["A", 0],
  ["K", 1],
  ["Q", 2],
  ["T", 3],
  ["9", 4],
  ["8", 5],
  ["7", 6],
  ["6", 7],
  ["5", 8],
  ["4", 9],
  ["3", 10],
  ["2", 11],
  ["J", 12],
]);

const findHandType = function (hands: Hand[]) {
  for (let i = 0; i < hands.length; i++) {
    const currHand = hands[i].orderedhand;
    if (currHand[0] === currHand[4]) {
      hands[i].handtype = HandType.fivekind;
    } else if (
      (currHand[0] !== currHand[1] && currHand[1] === currHand[4]) ||
      (currHand[0] == currHand[3] && currHand[0] !== currHand[4])
    ) {
      hands[i].handtype = HandType.fourkind;
    } else if (
      (currHand[0] === currHand[2] &&
        currHand[1] !== currHand[3] &&
        currHand[3] !== currHand[4]) ||
      (currHand[0] !== currHand[2] && currHand[1] === currHand[3]) ||
      (currHand[1] !== currHand[2] &&
        currHand[2] === currHand[4] &&
        currHand[0] !== currHand[1])
    ) {
      hands[i].handtype = HandType.three;
    } else if (
      (currHand[0] === currHand[2] &&
        currHand[1] !== currHand[3] &&
        currHand[3] === currHand[4]) ||
      (currHand[1] !== currHand[2] &&
        currHand[2] === currHand[4] &&
        currHand[0] === currHand[1])
    ) {
      hands[i].handtype = HandType.full;
    } else if (
      (currHand[0] === currHand[1] && currHand[2] === currHand[3]) ||
      (currHand[1] === currHand[2] && currHand[3] === currHand[4]) ||
      (currHand[0] === currHand[1] && currHand[3] === currHand[4])
    ) {
      hands[i].handtype = HandType.twopair;
    } else if (
      currHand[0] === currHand[1] ||
      currHand[1] === currHand[2] ||
      currHand[2] === currHand[3] ||
      currHand[3] === currHand[4]
    ) {
      hands[i].handtype = HandType.onepair;
    } else {
      hands[i].handtype = HandType.highcard;
    }
  }
  return hands;
};

const compareFn = function (a: Hand, b: Hand) {
  if (a.hand[0] !== b.hand[0]) {
    const cardrankA0 = cardRank.get(a.hand[0]);
    const cardrankB0 = cardRank.get(b.hand[0]);
    if (cardrankA0 !== undefined && cardrankB0 !== undefined) {
      if (cardrankA0 < cardrankB0) {
        return 1;
      } else if (cardrankA0 > cardrankB0) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  } else if (a.hand[0] === b.hand[0] && a.hand[1] !== b.hand[1]) {
    const cardrankA1 = cardRank.get(a.hand[1]);
    const cardrankB1 = cardRank.get(b.hand[1]);
    if (cardrankA1 !== undefined && cardrankB1 !== undefined) {
      if (cardrankA1 < cardrankB1) {
        return 1;
      } else if (cardrankA1 > cardrankB1) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  } else if (
    a.hand[0] === b.hand[0] &&
    a.hand[1] === b.hand[1] &&
    a.hand[2] !== b.hand[2]
  ) {
    const cardrankA2 = cardRank.get(a.hand[2]);
    const cardrankB2 = cardRank.get(b.hand[2]);
    if (cardrankA2 !== undefined && cardrankB2 !== undefined) {
      if (cardrankA2 < cardrankB2) {
        return 1;
      } else if (cardrankA2 > cardrankB2) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  } else if (
    a.hand[0] === b.hand[0] &&
    a.hand[1] === b.hand[1] &&
    a.hand[2] === b.hand[2] &&
    a.hand[3] !== b.hand[3]
  ) {
    const cardrankA3 = cardRank.get(a.hand[3]);
    const cardrankB3 = cardRank.get(b.hand[3]);
    if (cardrankA3 !== undefined && cardrankB3 !== undefined) {
      if (cardrankA3 < cardrankB3) {
        return 1;
      } else if (cardrankA3 > cardrankB3) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  } else if (
    a.hand[0] === b.hand[0] &&
    a.hand[1] === b.hand[1] &&
    a.hand[2] === b.hand[2] &&
    a.hand[3] === b.hand[3]
  ) {
    const cardrankA4 = cardRank.get(a.hand[4]);
    const cardrankB4 = cardRank.get(b.hand[4]);
    if (cardrankA4 !== undefined && cardrankB4 !== undefined) {
      if (cardrankA4 < cardrankB4) {
        return 1;
      } else if (cardrankA4 > cardrankB4) {
        return -1;
      } else {
        return 0;
      }
    }
    return 0;
  } else {
    return 0;
  }
};

const reducer = function (
  accumulator: number,
  currentValue: Hand,
  index: number,
) {
  const handBid: number = currentValue.bid;
  return accumulator + handBid * (index + 1);
};

const calculateRanks = function (file: string) {
  const hands = prepFile(file);
  const findhandtype = findHandType(hands);
  const orderedtypes = orderTypes(findhandtype);
  const orderedHandsPerType: Hand[][] = [];
  orderedtypes.forEach((handtypeArray) => {
    handtypeArray.sort(compareFn);
    orderedHandsPerType.push(handtypeArray);
  });
  orderedHandsPerType[6].forEach((hand) => console.log(hand));
  const handTypesTogether = orderedHandsPerType.flat();
  const sum = handTypesTogether.reduce(reducer, 0);
  return sum;
};

//calculateRanks("input.txt");

// part 2

const prepFile2 = function (file: string): Hand[] {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  splitLines.pop();
  let hands: Hand[] = [];
  splitLines.forEach((hand) => {
    const splitline = hand.split(" ");
    hands.push({
      hand: splitline[0],
      orderedhand: splitline[0]
        .split("")
        .map((card) => (!Number.isNaN(Number(card)) ? Number(card) : card))
        .map((card) => (card === "J" ? (card = "S") : card))
        .sort(),
      bid: Number(splitline[1]),
    });
  });

  hands.forEach((hand: Hand) => {
    const orderedhand = hand.orderedhand;
    let jIndexes: number[] = [];
    orderedhand.forEach((card, index: number) =>
      card === "S" ? jIndexes.push(index) : null,
    );
    orderedhand.splice(jIndexes[0], jIndexes.length);
    jIndexes.forEach((jindex) => {
      orderedhand.unshift("S");
    });
  });
  return hands;
};

const findHandType2 = function (hands: Hand[]) {
  for (let i = 0; i < hands.length; i++) {
    const currHand = hands[i].orderedhand;

    // should depend on the number of Js
    if (currHand[0] === "S") {
      let numberJs = 0;
      currHand.forEach((card) => (card === "S" ? ++numberJs : null));
      const handWithoutJ = currHand.slice(numberJs);
      const getHandType = findHandTypeOfRemainingHands(numberJs, handWithoutJ);
      hands[i].handtype = getHandType;
    } else {
      if (currHand[0] === currHand[4]) {
        hands[i].handtype = HandType.fivekind;
      } else if (
        (currHand[0] !== currHand[1] && currHand[1] === currHand[4]) ||
        (currHand[0] == currHand[3] && currHand[0] !== currHand[4])
      ) {
        hands[i].handtype = HandType.fourkind;
      } else if (
        (currHand[0] === currHand[2] &&
          currHand[1] !== currHand[3] &&
          currHand[3] !== currHand[4]) ||
        (currHand[0] !== currHand[2] && currHand[1] === currHand[3]) ||
        (currHand[1] !== currHand[2] &&
          currHand[2] === currHand[4] &&
          currHand[0] !== currHand[1])
      ) {
        hands[i].handtype = HandType.three;
      } else if (
        (currHand[0] === currHand[2] &&
          currHand[1] !== currHand[3] &&
          currHand[3] === currHand[4]) ||
        (currHand[1] !== currHand[2] &&
          currHand[2] === currHand[4] &&
          currHand[0] === currHand[1])
      ) {
        hands[i].handtype = HandType.full;
      } else if (
        (currHand[0] === currHand[1] && currHand[2] === currHand[3]) ||
        (currHand[1] === currHand[2] && currHand[3] === currHand[4]) ||
        (currHand[0] === currHand[1] && currHand[3] === currHand[4])
      ) {
        hands[i].handtype = HandType.twopair;
      } else if (
        currHand[0] === currHand[1] ||
        currHand[1] === currHand[2] ||
        currHand[2] === currHand[3] ||
        currHand[3] === currHand[4]
      ) {
        hands[i].handtype = HandType.onepair;
      } else {
        hands[i].handtype = HandType.highcard;
      }
    }
  }
  return hands;
};

const findHandTypeOfRemainingHands = function (
  numberJs: number,
  remainingCards: (string | number)[],
) {
  switch (numberJs) {
    case 1:
      if (
        remainingCards[0] === remainingCards[1] &&
        remainingCards[0] === remainingCards[2] &&
        remainingCards[0] === remainingCards[3]
      ) {
        return HandType.fivekind;
      } else if (
        (remainingCards[0] === remainingCards[1] &&
          remainingCards[0] === remainingCards[2]) ||
        (remainingCards[1] === remainingCards[2] &&
          remainingCards[1] === remainingCards[3])
      ) {
        // three of a kind
        return HandType.fourkind;
      } else if (
        remainingCards[0] === remainingCards[1] &&
        remainingCards[2] === remainingCards[3]
      ) {
        //two pair
        return HandType.full;
      } else if (
        remainingCards[0] === remainingCards[1] ||
        remainingCards[1] === remainingCards[2] ||
        remainingCards[2] === remainingCards[3]
      ) {
        //one pair
        return HandType.three;
      } else {
        return HandType.onepair;
      }

    case 2:
      if (
        remainingCards[0] === remainingCards[1] &&
        remainingCards[0] === remainingCards[2]
      ) {
        // three of a kind
        return HandType.fivekind;
      } else if (
        remainingCards[0] === remainingCards[1] ||
        remainingCards[1] === remainingCards[2]
      ) {
        // one pair
        return HandType.fourkind;
      } else {
        return HandType.three;
      }
    case 3:
      if (remainingCards[0] === remainingCards[1]) {
        return HandType.fivekind;
      } else {
        return HandType.fourkind;
      }

    case 4:
      return HandType.fivekind;

    case 5:
      return HandType.fivekind;

    default:
      console.log("default");
      return HandType.onepair;
  }
};

const calculateRanks2 = function (file: string) {
  const hands = prepFile2(file);
  const findhandtype = findHandType2(hands);
  //  console.log(findhandtype);
  const orderedtypes = orderTypes(findhandtype);
  const orderedHandsPerType: Hand[][] = [];
  orderedtypes.forEach((handtypeArray) => {
    handtypeArray.sort(compareFn);
    orderedHandsPerType.push(handtypeArray);
  });
  console.log(orderedHandsPerType[5]);
  const handTypesTogether = orderedHandsPerType.flat();
  const sum = handTypesTogether.reduce(reducer, 0);
  console.log(sum);
  return sum;
};

calculateRanks2("input.txt");
