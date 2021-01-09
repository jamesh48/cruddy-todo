const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    if (err) {
      throw ('we got a problem boss');
    } else {
      fs.appendFile(exports.dataDir + '/' + counterString + '.txt', text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, {id: counterString, text: text});
        }
      });
    }
  });

};

exports.readAll = (callback) => {


  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      var promiseArr = _.map(files, (fileName) => {
        //files has ["00001.txt","00002.txt"] so we map it to create new promise
        // that needs to resolve/ ater map promiseArr looks like  [Promise(0001.txt),Promise(00002.txt) ] (arbitrary)
        // then gets resolved at line 50.
        return new Promise((resolve, reject) => {
          fs.readFile(exports.dataDir + '/' + fileName, 'utf8', (err, data) => {
            var id = fileName.slice(0, fileName.indexOf('.'));
            fileEntry = {id: id, text: data};
            resolve(fileEntry);
          });
        });
      });
      //then the promisses gets resolved down here promise.all takes in a array we created using map
      // then resolves all of it so we get our datastructure of [{id: 0001}, {text: 'some text'}]
      // then call the callback on the value
      Promise.all(promiseArr).then((promiseValue) => {
        callback(null, promiseValue);
      }).catch((error) => {
        callback(error);
      });
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  let fileName = id + '.txt';

  console.log('path-> ' + exports.dataDir + '/' + fileName);

  fs.readFile(exports.dataDir + '/' + fileName, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: data});
    }
  });

};

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + '/' + id + '.txt', (err)=>{
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err, data) => {
        if (err) {
          throw err;
        } else {
          callback(null, data);
        }
      });
    }
  } );
};




exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      console.log('file to delete does not exist');
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
