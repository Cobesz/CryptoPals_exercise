function hexToString (hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

//The buffers module provides a way of handling streams of binary data.
let hex1 = new Buffer('1c0111001f010100061a024b53535009181c', 'hex');
let hex2 = new Buffer('686974207468652062756c6c277320657965', 'hex');

//make an empty array
let results = [];

//loop through the first array
for (let i = 0; i < hex1.length; i++) {

    // add xor of each first element to the results array
    results.push(hex1[i] ^ hex2[i])
}
// make a new buffer and translatre is back to a hexString
let resultsToHex = new Buffer(results).toString('hex');

// see what the message says
console.log(hexToString(resultsToHex));




