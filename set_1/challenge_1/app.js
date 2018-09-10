var btoa = require('btoa');


function hexToString (hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

// convert string to hex
let hex = hexToString('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');

//log it to make sure it's ok
console.log(hex);

//convert hex to base64
let base64String = btoa(hex);

//log it to check if output is correct
console.log(base64String);

