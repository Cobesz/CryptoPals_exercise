var btoa = require('btoa');


function hexToString (hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

let hex = hexToString('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');

console.log(hex);

let base64String = btoa(hex);

console.log(base64String);
