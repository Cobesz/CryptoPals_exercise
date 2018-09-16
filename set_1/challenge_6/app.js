let fs = require('fs');

let input = fs.readFileSync(__dirname + '/inputs/input.txt', 'utf-8');

let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let alphabetBuffer = Buffer.concat([
    new Buffer(alphabet),
    new Buffer(alphabet.toUpperCase()),
    new Buffer(' ')
]);

function xor(payload, key) {
    let results = [];
    let index;

    for (let i = 0; i < payload.length; i++) {
        index = i % key.length;
        results.push(payload[i] ^ key[index])
    }
    return new Buffer(results)
}

function forEachPair(coll, fn) {
    coll.reduce(function (a, b) {
        fn(a, b);
        return b
    })
}

function mapPairs(coll, fn) {
    let result = [];

    forEachPair(coll, function (a, b) {
        result.push(fn(a, b))
    });
    return result
}

function avg(coll) {
    let sum = coll.reduce(function (a, b) {
        return a + b
    });

    return sum / coll.length
}

// count the set bits of a number (the '1's in base-2 string)
function popCount(x) {
    let count = 0;
    while (x > 0) {
        count += x & 1;
        x >>= 1
    }
    return count
}

function bufferPopCount(b) {
    let results = [];
    for (let i = 0; i < b.length; i++) {
        results.push(popCount(b[i]))
    }

    return results.reduce(function (a, b) {
        return a + b
    })
}

function hammingsDistance(x, y) {
    return bufferPopCount(xor(x, y))
}

function getBlocks(input, size, nBlocks) {
    let blocks = [];
    let index;

    if (nBlocks === undefined) {
        nBlocks = Math.ceil(input.length / size)
    }

    for (let i = 0; i < nBlocks; i++) {
        //first time = 0 * 2
        index = i * size; // index = 0 for first time
        blocks.push(input.slice(index, index + size)) //
    }

    return blocks;
}

// returns the normalized edit distance between blocks of `size`
function testKeySize(input, size, nBlocks) {
    let blocks = getBlocks(input, size, nBlocks);
    let distances = mapPairs(blocks, hammingsDistance);

    return avg(distances) / size
}

// returns the 3 most likely key sizes for input
// input is the whole txt file which is epicly long. An array of 2876 object to be exact
//the function tests the input and returns the 3 key sizes that are most likely to be the correct ones to be used.
function findKeySizes(input) {
    let nBlocks = 10; // number of blocks to compare
    let results = [];

    for (let size = 2; size <= 40; size++) {
        results.push({
            size: size,
            distance: testKeySize(input, size, nBlocks)
        })
    }

    // sort the results based on the lowest distance
    return results
        .sort(function (highest, lowest) {
            return highest.distance - lowest.distance
        })
}

// transposes blocks into a block for each index
function transposeBlocks(blocks) {
    let max = blocks[0].length;
    let transposed = [];
    let block;

    for (let i = 0; i < max; i++) {
        block = [];
        for (let x = 0; x < blocks.length; x++) {
            block.push(blocks[x][i])
        }
        transposed.push(new Buffer(block))
    }
    return transposed
}
// the whole input file in base64 and the keysize with the lowest distance
function breakXor(input, keySize) {
    //returns the chopped up version of the inputs file.
    let blocks = getBlocks(input, keySize);

    // returns a huge array with each block as object. each block is a line in the song text
    let transposedBlocks = transposeBlocks(blocks);

    let keyBytes = transposedBlocks.map(breakSingleByteXor);
    let key = new Buffer(keyBytes);
    return {
        keySize: keySize,
        key: key,
        // once again XOR the entire input with the correct key.
        plaintext: xor(input, key)
    }
}

function breakSingleByteXor(transposedBlock) {
    let candidates = [];
    let payload;

    //compare each block (line in songtext) with all possible asci characters
    for (let i = 0; i < 256; i++) {
        payload = xor(transposedBlock, [i]);
        candidates.push({key: i, score: scoreText(payload)})
    }

    return candidates.sort(function (a, b) {
        return b.score - a.score
    })[0].key
}

function scoreText(input) {
    let score = 0;

    for (let i = 0; i < input.length; i++) {
        score += alphabetBuffer.indexOf(input[i]) > -1
    }

    return score / input.length
}


let bufferedInput = new Buffer(input, 'base64');

//find the key sizes that can be used in the decryption
let keySizes = findKeySizes(bufferedInput);
// console.log(keySizes[0]);
//fire the breakXor function with the key size that has the lowest distance.
let decrypted = breakXor(bufferedInput, keySizes[0].size);

// console.log(decrypted);

// decrypted.key is the key we found out above
console.log('key: ' + decrypted.key.toString());
// plaintext is the whole input file XORed with the key from above.
console.log(decrypted.plaintext.toString());