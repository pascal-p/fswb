const assert = require('assert');

// Create
exports.insertDocument = (db, doc, collection, cb) => {
  const coll = db.collection(collection);

  return coll.insertOne(doc);  // return a Promise
};


// Read
exports.findDocuments = (db, collection, cb) => {
  const coll = db.collection(collection);

  return coll.find({}).toArray();
};

// Update
exports.updateDocument = (db, doc, update, collection, cb) => {
  const coll = db.collection(collection);

  return coll.updateOne(doc, { $set: update }, null);
};

// Delete
exports.removeDocument = (db, doc, collection, cb) => {
  const coll = db.collection(collection);

  return coll.deleteOne(doc);
};
