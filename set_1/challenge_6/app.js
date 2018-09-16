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

// subsequently moved to utils
function getBlocks(input, size, n) {
    let blocks = [];
    let index;

    if (n === undefined) {
        n = Math.ceil(input.length / size)
    }

    for (let i = 0; i < n; i++) {
        index = i * size;
        blocks.push(input.slice(index, index + size))
    }

    return blocks
}

// returns the normalized edit distance between blocks of `size`
function testKeySize(input, size, nBlocks) {
    let blocks = getBlocks(input, size, nBlocks);
    let distances = mapPairs(blocks, hammingsDistance);

    return avg(distances) / size
}

// returns the 3 most likely key sizes for input
function findKeySizes(input) {
    let nBlocks = 10; // number of blocks to compare
    let results = [];

    for (let i = 2; i <= 40; i++) {
        results.push({
            size: i,
            distance: testKeySize(input, i, nBlocks)
        })
    }

    return results
        .sort(function (a, b) {
            return a.distance - b.distance
        })
        .slice(0, 3)
}

// transposes blocks into a block for each index (a la lodash.zip)
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

function breakXor(input, keySize) {
    let blocks = getBlocks(input, keySize);
    let transposedBlocks = transposeBlocks(blocks);

    let keyBytes = transposedBlocks.map(breakSingleByteXor);
    let key = new Buffer(keyBytes);

    return {
        keySize: keySize,
        key: key,
        plaintext: xor(input, key)
    }
}

function breakSingleByteXor(ciphertext) {
    let candidates = [];
    let payload;

    for (let i = 0; i < 256; i++) {
        payload = xor(ciphertext, [i]);
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

// console.log( hammingsDistance(new Buffer('this is a test'), new Buffer('wokka wokka!!!')) === 37 )

let b = new Buffer(input, 'base64');
let keySizes = findKeySizes(b);
let decrypted = breakXor(b, keySizes[0].size);

console.log('key: ' + decrypted.key.toString());
console.log();
console.log(decrypted.plaintext.toString());