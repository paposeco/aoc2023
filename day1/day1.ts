import fs from "fs";

const prepFile = function(file: string) {
    //const fs = require("fs");
    const fileToString: string = fs.readFileSync(file).toString();
    const calories: string[] = fileToString.split("\n");
    return calories;
};


console.log(prepFile("inputmini.txt"));
