import fs from "fs";

const compare = function (a: number, b: number) {
  return a - b;
};

interface Card {
  cardNumber: number;
  numbersOwned: number[];
  winningNumbersMap: Map<number, number>;
  cardValue: number;
}

const prepFile = function (file: string): string[] {
  const fileToString: string = fs.readFileSync(file).toString();
  const splitLines = fileToString.split(/\n/);
  splitLines.pop();
  return splitLines;
};

// part 1

const organizeCards = function (file: string): Card[] {
  const splitLines = prepFile(file);
  let organizedCards: Card[] = [];
  for (let i = 0; i < splitLines.length; i++) {
    const card = splitLines[i];
    const colon = card.indexOf(":");
    const vbar = card.indexOf("|");
    const numbersOwnedString = card.substring(colon + 2, vbar - 1).split(" ");
    let numbersOwned: number[] = [];
    numbersOwnedString.forEach((num) =>
      num !== "" ? numbersOwned.push(Number(num)) : null,
    );
    const numbersWinString = card.substring(vbar + 2).split(" ");
    let numbersWin: number[] = [];
    numbersWinString.forEach((num) =>
      num !== "" ? numbersWin.push(Number(num)) : null,
    );
    numbersOwned.sort(compare);
    numbersWin.sort(compare);
    const winningNumbersMap: Map<number, number> = new Map();
    numbersWin.forEach((num) => winningNumbersMap.set(num, 1));
    organizedCards.push({
      cardNumber: i + 1,
      numbersOwned: numbersOwned,
      winningNumbersMap: winningNumbersMap,
      cardValue: 0,
    });
  }
  return organizedCards;
};

const countPoints = function (file: string) {
  const cards: Card[] = organizeCards(file);
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let points = 0;
    card.numbersOwned.forEach((num) =>
      card.winningNumbersMap.has(num)
        ? points === 0
          ? (points = 1)
          : (points *= 2)
        : null,
    );
    card.cardValue = points;
  }
  let sum = 0;
  cards.forEach((card) => (sum += card.cardValue));
  return sum;
};

//part 2

const organizedCardsPart2 = function (
  file: string,
): [Card[], Map<number, number>] {
  const splitLines = prepFile(file);
  let organizedCards: Card[] = [];
  const cardMap: Map<number, number> = new Map();
  for (let i = 0; i < splitLines.length; i++) {
    const card = splitLines[i];
    cardMap.set(i + 1, 1);
    const colon = card.indexOf(":");
    const vbar = card.indexOf("|");
    const numbersOwnedString = card.substring(colon + 2, vbar - 1).split(" ");
    let numbersOwned: number[] = [];
    numbersOwnedString.forEach((num) =>
      num !== "" ? numbersOwned.push(Number(num)) : null,
    );
    const numbersWinString = card.substring(vbar + 2).split(" ");
    let numbersWin: number[] = [];
    numbersWinString.forEach((num) =>
      num !== "" ? numbersWin.push(Number(num)) : null,
    );
    numbersOwned.sort(compare);
    numbersWin.sort(compare);
    const winningNumbersMap: Map<number, number> = new Map();
    numbersWin.forEach((num) => winningNumbersMap.set(num, 1));
    organizedCards.push({
      cardNumber: i + 1,
      numbersOwned: numbersOwned,
      winningNumbersMap: winningNumbersMap,
      cardValue: 0,
    });
  }
  return [organizedCards, cardMap];
};

const countScratchCards = function (file: string) {
  const cards = organizedCardsPart2(file);
  const organizedcards: Card[] = cards[0];
  const cardMap = cards[1];
  for (let i = 0; i < organizedcards.length; i++) {
    // console.log("******************");
    const card: Card = organizedcards[i];
    const currCardOnMap = cardMap.get(i + 1);
    // console.log("card on map: " + currCardOnMap);
    // console.log("card number: " + card.cardNumber);
    let matches = 0;
    card.numbersOwned.forEach((num) =>
      card.winningNumbersMap.has(num) ? matches++ : null,
    );
    //console.log("matches: " + matches);
    if (currCardOnMap !== undefined) {
      for (let j = 1; j <= matches; j++) {
        //  console.log("next card: " + Number(i + j + 1));
        const nextcard = cardMap.get(i + j + 1);
        if (nextcard !== undefined) {
          cardMap.set(i + j + 1, nextcard + currCardOnMap);
        }
      }
    }
  }
  let sum = 0;
  const mapIterator = cardMap[Symbol.iterator]();
  for (const item of mapIterator) {
    sum += item[1];
  }
  console.log(sum);
};

countScratchCards("input.txt");
