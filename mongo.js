var EventEmitter = require('events').EventEmitter;
var log = require('debug')('sourced-repo-mongo');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var url = require('url');
var util = require('util');

function Mongo () {
  this.db = null;
  EventEmitter.call(this);
}

util.inherits(Mongo, EventEmitter);

Mongo.prototype.connect = function connect (mongoUrl) {
  var self = this;
  MongoClient.connect(mongoUrl, function (err, client) {
    if (err) {
      log('✗ MongoDB Connection Error. Please make sure MongoDB is running: ', err);
      self.emit('error', err);
    }
    var expanded = url.parse(mongoUrl);
    var dbName = expanded.pathname.replace('/', '');
    var db = client.db(dbName);
    self.db = db;
    log('initialized connection to mongo at %s', mongoUrl);
    self.emit('connected', db);
  });
};

module.exports = new Mongo();