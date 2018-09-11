let input = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';

//hier wordt het alfabet in een array gezet, lower en uppercase.
let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let keys = alphabet.split('').concat(alphabet.toUpperCase().split(''));

function score(results) {
    // hier wordt results opgesplitst in losse opjecten
    return results.split('')
        .map(function (result) {
            // hier wordt hier object gematched met de entries uti de originele keys array. Klopt het krijgt het een 1, is het fout een 0.
            // Op basis van deze cijfers wordt de score opgebouwd.
            if (keys.indexOf(result) > -1 || result === ' ') {
                return 1
            } else {
                return 0
            }
        })
        .reduce(function (a, b) {
            return a + b
        })
}

//<Buffer 1b 37 37 33 31 36 3f 78 15 1b 7f 2b 78 34 31 33 3d 78 39 78 28 37 2d 36 3c 78 37 3e 78 3a 39 3b 37 36>
let inputBuffer = new Buffer(input, 'hex');

function xor(key) {
    // hier wordt een entry uit de keys array omgezet naar zijn desbetreffende charCode.
    // a is bijvoorbeeld 97, b is 98, c is 99 etc
    let charOfKey = key.charCodeAt();
    let results = [];
    // Hier wordt met elke letter uit de keys array xor gedaan met de entry's uit de inputBuffer
    // 1b ^ 97, 37 ^ 97, 37 ^ 97, 33 ^ 97 ... etc
    // 1b ^ 98, 37 ^ 98, 37 ^ 98, 33 ^ 98 ... etc
    // 1b ^ 99, 37 ^ 99, 37 ^ 99, 33 ^ 99 ... etc
    //het resultaat wordt in een nieuwe array gestopt en als resultaat terug gegeven aan de decrypt functie.
    for (let i = 0; i < inputBuffer.length; i++) {
        results.push(inputBuffer[i] ^ charOfKey);
    }
    return new Buffer(results).toString()
}

//            Hier worden alle keys (dus a, b, c, etc) stuk voor stuk door de xor functie gegooid.
let decrypt = keys.map(function (key) {
    let result = xor(key);
    // hier wordt de score functie uitgevoerd met de results als parameter.
    return {result: result, score: score(result)}
})  //Hier wordt het resultaat van de xor functie met de hoogste score gesorteerd, zodat deze als eerste in de array terug komt.
// Dit is ook de reden dat je de juiste waarde terug krijgt als je decrypt[0] uitvoert.
    .sort(function (a, b) {
        return b.score - a.score
    });


// console.log(decrypt);

// console.log(inputBuffer);
console.log(JSON.stringify(decrypt[0], null, 2));
// Hex strings omzetten naar binary, vervolgens kijken welke niet overeenkomen met letters en cijfers
// Die eruit flikkeren en dan t hele zooitje weer omzetten naar Hex en vervolgens dan text
