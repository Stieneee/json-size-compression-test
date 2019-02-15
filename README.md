# JSON Size and Compression Test

A quick and dirty test to estimate the JSON stringified length of array of objects that will fit into a particular byte size.

Tests with and without compression.

Used to understand limits around Firestore's 1 MB object limit.

## Usage

If you clone this repo you can adjust the boject function and size limites.

``` bash
node index.js
```

## Results

The included object is based off of a an object used to store information at [logmy.io](https://logmy.io).
A function is used to added randomness to the array of objects to ensure reasonable accuracy once compressed.

>JSON.stringify objects: 10506 bytes: 1048629
>Execution Time 105ms
>
>Finidng Limit uisng GZIP
>With GZIP objects: 37698 bytes: 1048592
>Execution Time 5377ms
>
>Finidng Limit uisng BROTLI
>With BROTLI objects: 50127 bytes: 1048593
>Execution Time 162435ms
>
>Finidng Limit uisng ZSTD
>With ZSTD objects: 40195 bytes: 1048579
>Execution Time 891ms
>
>Comparing Max Size
>JSON Encode:5ms  Decode:9ms
>1048743
>JSON GZIP Encode:41ms  Decode:13ms
>292689
>Percentage of size: 0.2790855338247788
>JSON BROTLI Encode:1815ms  Decode:20ms
>220535
>Percentage of size: 0.2102850746083645
>JSON ZSTD Encode:10ms  Decode:10ms
>273897
>Percentage of size: 0.26116693985085004