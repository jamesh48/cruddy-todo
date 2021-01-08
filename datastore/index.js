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
      var mappedFiles = _.map(files, (text, id) => {
        text = text.slice(0, text.indexOf('.'));
        var fileEntry = {id: text, text: text};
        return fileEntry;
      });
      callback(null, mappedFiles);
    }
  });
};

//Please note, however, you must still include a text field in your response to the client, and it's recommended that you use the message's id (that you identified from the filename) for both the id field and the text field. Doing so will have the effect of changing the presentation of your todo items for the time being; we'll address this issue shortly.

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
      console.log('error!');
      callback(err);
    } else {
      console.log('data-> ' + data, 'id-> ' + id);
      callback(null, {id, text: data});
    }
  });

};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
