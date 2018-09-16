let input = 'Burning \'em, if you ain\'t quick and nimble\nI go crazy when I hear a cymbal';
let key = 'ICE';
let solution = '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f';

function xor(input, key) {
    let results = [];
    let index;

    for (let i = 0; i < input.length; i++) {
        index = i % key.length;
        // 42 ^ 49 -> index = 0; result = 27
        // 75 ^ 43 -> index = 1; result = 96
        // 72 ^ 45 -> index = 2; result = 101
        // 6e ^ 49 -> index = 0; result = 49

        results.push(input[i] ^ key[index]);
        // results array = [27, 96, 101, 49 ........ ]
    }

    return new Buffer(results)
}
// input example
//<Buffer 42 75 72 6e 69 6e 67 20 27 65 6d 2c 20 69 66 20 79 6f 75 20 61 69 6e 27 74 20 71 75 69 63 6b 20 61 6e 64 20 6e 69 6d 62 6c 65 0a 49 20 67 6f 20 63 72 ... >

// key example
// <Buffer 49 43 45>
// XOR function gets fired with the params input and key. Input and key are JS Buffers
let result = (xor(new Buffer(input), new Buffer(key)).toString('hex'));

console.log(result);