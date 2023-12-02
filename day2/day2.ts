import fs from "fs";

interface Turn{
    red: number,
    blue: number,
    green: number
}

interface Game{
    id: number,
    turns: Turn[]
}

const prepFile = function(file: string): Game[]{
    const fileToString: string = fs.readFileSync(file).toString();
    const splitLines = fileToString.split(/\n/);
    splitLines.pop();
    let games: Game[] = [];
    for(let i = 0; i < splitLines.length; i++){
        const line = splitLines[i];
        const lineColon = line.split(": ");
        const gameId = Number(lineColon[0].substring(5));
        const lineSemiColons = lineColon[1].split("; ");
        const currGameTurn: Turn[] = []; 
        lineSemiColons.forEach((gameturn) =>{
            const gameTurnComma = gameturn.split(", ");
            let gameTurn: Turn = {red:0, blue:0, green:0}; 
            gameTurnComma.forEach((color) =>{
                const spaceIndex = color.indexOf(" ");
                const numberCubes = Number(color.substring(0, spaceIndex));
                if(color.includes("red")){
                    gameTurn.red = numberCubes;
                }else if(color.includes("blue")){
                    gameTurn.blue = numberCubes;
                }else{
                    gameTurn.green = numberCubes;
                }
            })

            currGameTurn.push(gameTurn);
        })
        const gameTurnData = { id: gameId, turns: currGameTurn }
        games.push(gameTurnData);
    }
    return games;
}


// part 1
const sumOfPossibleGameIds = function(file:string, maxRed: number, maxGreen: number, maxBlue: number): number{
    const games = prepFile(file);
    let sumIds: number = 0;
    games.forEach((game: Game) =>{
        const gameTurns:Turn[] = game.turns;
        let possible = true;
        gameTurns.forEach((turn: Turn) =>{
            if(turn.red > maxRed || turn.green > maxGreen || turn.blue > maxBlue){
                possible = false;
            }
        })
        if(possible){
            sumIds += game.id;
        }
    })
    console.log(sumIds);
    return sumIds;
}

// part 2
const minSetCubes = function(file:string): number{
    const games: Game[] = prepFile(file);
    let sumOfPower = 0;
    games.forEach((game) => {
        let minRed = 1;
        let minBlue = 1;
        let minGreen = 1;
        game.turns.forEach((turn) =>{
            if(minRed < turn.red){
                minRed= turn.red;
            }
            if(minBlue < turn.blue){
                minBlue = turn.blue
            }
            if(minGreen< turn.green){
                minGreen = turn.green;
            }
        })
        sumOfPower += minRed*minBlue*minGreen;
    })
    console.log(sumOfPower)
    return sumOfPower
}

//sumOfPossibleGameIds("input.txt", 12,13,14);
minSetCubes("input.txt");
