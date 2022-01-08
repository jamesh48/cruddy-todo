// const fs = require("fs");
import fs from "fs";
// const path = require("path");
import path from "path";
const sprintf = require("sprintf-js").sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num: number) => {
  return sprintf("%05d", num);
};

const readCounter = (callback: (err: null, fileData: number) => void) => {
  fs.readFile(exports.counterFile, (err: any, fileData: Buffer) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (
  count: number,
  callback: (err: any, counterString: string) => void
) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err: any) => {
    if (err) {
      throw "error writing counter";
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (
  callback: (err: any, counterString: string) => void
) => {
  readCounter((err, counterNumber) => {
    if (err) {
      throw "cant do that";
    } else {
      counterNumber++;
      writeCounter(counterNumber, (err, counterString) => {
        if (err) {
          throw "cant do that";
        } else {
          callback(null, counterString);
          // return counterString;
        }
      });
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
