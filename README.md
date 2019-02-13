# JSON Size and Compression Test

A quick and dirty test to estimate the JSON stringified length of array of objects that will fit into a particular byte size.

Tests with and without compression.

Used to understand limits around Firestore's 1 MB object limit.

## Usage

Clone

Edit object and size limit.

``` bash
node index.js
```

## Results

The included object is based off of a an object used to store information at [logmy.io](https://logmy.io).
A function is used to added randomness to the array of objects to ensure reasonable accuracy once compressed.

> Finidng Limit of JSON.stringify to fit in  1048576  bytes
> JSON.stringify objects: 10504 bytes: 1048505
> Execution Time 27030ms
>
> Finidng Limit uisng GZIP
> With GZIP objects: 39505 bytes: 1040992
> Execution Time 3581ms
>
> Comparing Max Size
> JSON Encode:7ms  Decode:20ms
> 1048495
> JSON GZIP Encode:40ms  Decode:52ms
> 292524
> Percentage of size: 0.2789941773685139