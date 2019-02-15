const logUpdate = require('log-update');
const zlib = require('zlib');
const brotli = require('brotli');
const ab2str = require('arraybuffer-to-string')

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
let jsonData = JSON.stringify({});
let start = new Date()
let searchStep = 10000;


while (searchStep >= 1){
  while (true) {    
    for (let index = 0; index < searchStep; index++) objectArray.push(object());  
    jsonData = JSON.stringify(objectArray, 0);
    logUpdate('JSON.stringify objects:', objectArray.length, 'bytes:', jsonData.length);
    if (bytesLimit < jsonData.length) break;
  }
  for (let index = 0; index < searchStep; index++) objectArray.pop();  
  searchStep = searchStep / 10.0;
}


let maxJSON = objectArray.length - 1

let end = new Date() - start
console.log(`Execution Time ${end}ms`);
console.log('');


// JSON GZIP ////////////////////////////////////////////

console.log('Finidng Limit uisng GZIP\n');
objectArray = [];
jsonData = JSON.stringify({});
start = new Date();
searchStep = 10000;

while (searchStep >= 1){
  while (true) {    
    for (let index = 0; index < searchStep; index++) objectArray.push(object());  
    jsonData = zlib.gzipSync(JSON.stringify(objectArray, 0));
    logUpdate('With GZIP objects:', objectArray.length, 'bytes:', jsonData.length);
    if (bytesLimit < jsonData.length) break;
  }
  for (let index = 0; index < searchStep; index++) objectArray.pop();  
  searchStep = searchStep / 10.0;
}

end = new Date() - start
console.log(`Execution Time ${end}ms\n`);

// // JSON BROTLI ////////////////////////////////////////////

// console.log('Finidng Limit uisng BROTLI\n');
// objectArray = [];
// jsonData = JSON.stringify({});
// start = new Date();
// searchStep = 10000;

// while (searchStep >= 1){
//   while (true) {    
//     for (let index = 0; index < searchStep; index++) objectArray.push(object());  
//     jsonData = brotli.compress(JSON.stringify(objectArray, 0));
//     logUpdate('With BROTLI objects:', objectArray.length, 'bytes:', jsonData.length);
//     if (bytesLimit < jsonData.length) break;
//   }
//   for (let index = 0; index < searchStep; index++) objectArray.pop();  
//   searchStep = searchStep / 10.0;
// }

// end = new Date() - start
// console.log(`Execution Time ${end}ms\n`);

// Speed Test Compare///////////////////////////////

console.log('Comparing Max Size');
objectArray = [];
jsonData = JSON.stringify({});

for (let index = 0; index < maxJSON; index++) {
  objectArray.push(object());  
}

// JSON Speed 
start = new Date()
jsonData = JSON.stringify(objectArray, 0);
let encode = new Date() - start
start = new Date()
let tmp = JSON.parse(jsonData)
let decode = new Date() - start
console.log(`JSON Encode:${encode}ms  Decode:${decode}ms`);
console.log(jsonData.length);

let uncompressedSize = jsonData.length;

// JSON GZIP Speed
start = new Date()
jsonData = zlib.gzipSync(JSON.stringify(objectArray, 0));
encode = new Date() - start
start = new Date()
tmp = JSON.parse(zlib.gunzipSync(jsonData));
decode = new Date() - start
console.log(`JSON GZIP Encode:${encode}ms  Decode:${decode}ms`);
console.log(jsonData.length);
console.log('Percentage of size:', jsonData.length/uncompressedSize);

// JSON BROTLI Speed
start = new Date()
jsonData = brotli.compress(JSON.stringify(objectArray, 0));
encode = new Date() - start
start = new Date()
console.log(brotli.decompress(jsonData));
tmp = JSON.parse(brotli.decompress(jsonData));
decode = new Date() - start
console.log(`JSON GZIP Encode:${encode}ms  Decode:${decode}ms`);
console.log(jsonData.length);
console.log('Percentage of size:', jsonData.length/uncompressedSize);