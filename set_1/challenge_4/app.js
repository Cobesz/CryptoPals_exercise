//nodeJS library for reading files
let fs = require('fs');

// reads the strings from the inputs file
let input = fs.readFileSync(__dirname + '/inputs/inputs.txt', 'utf-8');


let alphabet = 'abcdefghijklmnopqrstuvwxyz';
//place the alphabet in a buffer with the capitalized version in it.
let alphabetBuffer = new Buffer(alphabet.concat(alphabet.toUpperCase()));


function score(payload) {
    let score = 0;

    //loop to match the payload objects with the alphabet
    for (let i = 0; i < payload.length; i++) {
        //if there's a match, increase the score.
        if (alphabetBuffer.indexOf(payload[i]) > -1 || payload[i] === 32) {
            score++
        }
    }
    return score
}


function xor(payload, key) {
    //declare array which will contain the results of the XOR
    let results = [];

    //loops every character in the payload (bufferedInput) with all asci characters
    for (let i = 0; i < payload.length; i++) {
        results.push(payload[i] ^ key[0]);
    }

    //return the value as payload in the decrypt function
    return new Buffer(results);
}


function decrypt(bufferedInput) {
    //declare an array for the candidates in which the results get pushed
    let candidates = [];
    //declare a variable for the XORing.
    let payload;
                    // all 256 characters in asci table
    for (let i = 0; i < 256; i++) {

        //fires the xor function with the input and the character(s) from the loop integerx
        payload = xor(bufferedInput, [i]);
        candidates.push({
            // the byteArray (or buffer in JS) that is used
            payload: payload,
            //the decrypted string, toString() makes the payload decimal again.
            string: payload.toString(),
            //the score received
            // also fires the score function
            score: score(payload)
        })
    }

    return candidates.sort(function(a, b) {
        return b.score - a.score
    })
}

//this function takes the input one at a time and splits it on the whitespace/enter key.
//it returns an object with the payload, string and score.
let candidates = input.split('\n')
    .map(function(input) {
        //creates a buffer which can be used to xor with
        let bufferedInput = new Buffer(input, 'hex');

        //fires the decrypt functies with the the newly created bufferedInput byteArray.
        //it returns the first result in the created array.
        return decrypt(bufferedInput)[0];
    })
    .sort(function(lowest, highest) {
        return highest.score - lowest.score
    });

console.log(candidates[0]);
