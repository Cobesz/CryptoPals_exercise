function hexToString (hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

console.log(hexToString('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736'));
