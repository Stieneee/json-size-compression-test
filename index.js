const logUpdate = require('log-update');
const zlib = require('zlib');

// SETUP

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const object = function () {
  return {
    src: "192.168.100." + getRandomInt(255).toString(),
    dst: "" + getRandomInt(255).toString() + getRandomInt(255).toString() + getRandomInt(255).toString(),
    srcp:  getRandomInt(65000),
    dstp: getRandomInt(65000),
    in: getRandomInt(2000000000),
    out: getRandomInt(2000000000),
    }
}

const bytesLimit = 1048576



// JSON STRINGIFY ///////////////////////////////////

console.log('Finidng Limit of JSON.stringify to fit in ', bytesLimit, ' bytes' )

let objectArray = [];
let jsonString = JSON.stringify({});
let start = new Date()

while (bytesLimit > jsonString.length) {
  logUpdate('JSON.stringify objects:', objectArray.length, 'bytes:', jsonString.length);
  
  objectArray.push(object());  
  jsonString = JSON.stringify(objectArray, 0);
}

let maxJSON = objectArray.length - 1

let end = new Date() - start
console.log(`Execution Time ${end}ms`);
console.log('');


// JSON GZIP BTOA ////////////////////////////////////////////

console.log('Finidng Limit uisng GZIP\n');
// objectArray = [];
jsonString = JSON.stringify({});
start = new Date()

while (bytesLimit > jsonString.length) {
  logUpdate('With GZIP objects:', objectArray.length, 'bytes:', jsonString.length);

  for (let index = 0; index < 1000; index++) {
    objectArray.push(object());  
  }
  jsonString = (zlib.gzipSync(JSON.stringify(objectArray, 0))).toString('utf8');
}

end = new Date() - start
console.log(`Execution Time ${end}ms\n`);

// Speed Test Compare///////////////////////////////

console.log('Comparing Max Size');
objectArray = [];
jsonString = JSON.stringify({});

for (let index = 0; index < maxJSON; index++) {
  objectArray.push(object());  
}

// JSON Speed 
start = new Date()
jsonString = JSON.stringify(objectArray, 0);
let encode = new Date() - start
let tmp = JSON.parse(jsonString)
let decode = new Date() - start
console.log(`JSON Encode:${encode}ms  Decode:${decode}ms`);
console.log(jsonString.length);

let uncompressedSize = jsonString.length;

// JSON GZIP Speed
start = new Date()
jsonString = zlib.gzipSync(JSON.stringify(objectArray, 0));
encode = new Date() - start
tmp = JSON.parse(zlib.gunzipSync(jsonString));
decode = new Date() - start
console.log(`JSON GZIP Encode:${encode}ms  Decode:${decode}ms`);
console.log(jsonString.length);
console.log('Percentage of size:', jsonString.length/uncompressedSize);

// console.log(jsonString.toString());