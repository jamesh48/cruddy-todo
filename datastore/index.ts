// const fs = require('fs');
import fs from "fs";
import path from "path";
import _ from "underscore";
const counter = require("./counter");

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (
  text: string,
  callback: (
    err: any,
    { id, text }: { id: string; text: string }
  ) => void
) => {
  counter.getNextUniqueId((err: any, counterString: string) => {
    if (err) {
      throw "we got a problem boss";
    } else {
      fs.appendFile(exports.dataDir + "/" + counterString + ".txt", text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id: counterString, text: text });
        }
      });
    }
  });
};

type PromiseValue = { id: string; text: string };
type Files = string[];

exports.readAll = (
  callback: (err: any, promiseValue?: PromiseValue[]) => void
) => {
  fs.readdir(exports.dataDir, (err: any, files: Files) => {
    if (err) {
      throw err;
    } else {
      const promiseArr: Promise<PromiseValue>[] = _.map(files, (fileName) => {
        const newPromise: Promise<PromiseValue> = new Promise((resolve, reject) => {
          fs.readFile(exports.dataDir + "/" + fileName, "utf8", (err, data) => {
            if (err) {
              reject(err.message);
            }
            var id: string = fileName.slice(0, fileName.indexOf("."));
            const fileEntry: PromiseValue = { id: id, text: data };
            resolve(fileEntry);
          });
        });
        return newPromise;
      });

      Promise.all(promiseArr)
        .then((promiseValues) => {
          callback(null, promiseValues);
        })
        .catch((error) => {
          callback(error);
        });
    }
  });
};

exports.readOne = (
  id: string,
  callback: (
    err: any,
    { id, text }?: { id: string; text: string }
  ) => void
) => {
  let fileName = id + ".txt";
  fs.readFile(exports.dataDir + "/" + fileName, "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (
  id: string,
  text: string,
  callback: (err: any | null, data?: string) => void
): void => {
  fs.access(exports.dataDir + "/" + id + ".txt", (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(
        exports.dataDir + "/" + id + ".txt",
        text,
        (err: any, data?: any) => {
          if (err) {
            throw err;
          } else {
            callback(null, data);
          }
        }
      );
    }
  });
};

exports.delete = (id: string, callback: (err: any) => void) => {
  fs.unlink(exports.dataDir + "/" + id + ".txt", (err) => {
    if (err) {
      console.log("file to delete does not exist");
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
