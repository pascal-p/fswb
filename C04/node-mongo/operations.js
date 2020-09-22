const assert = require('assert');

// Create
exports.insertDocument = (db, doc, collection, cb) => {
  const coll = db.collection(collection);

  coll.insertOne(doc, (err, res) => {
    assert.equal(err, null);

    console.log(`Inserted ${res.result.n} documents into the collection ${collection}`);
    cb(res);
  });
};


// Read
exports.findDocuments = (db, collection, cb) => {
  const coll = db.collection(collection);

  coll.find({}).toArray((err, docs) => {
    assert.equal(err, null);
    cb(docs);
  });
};

// Update
exports.updateDocument = (db, doc, update, collection, cb) => {
  const coll = db.collection(collection);

  coll.updateOne(doc, { $set: update }, null, (err, res) => {
    assert.equal(err, null);

    console.log(`Updated the document with ${update}`);
    cb(res);
  });
};

// Delete
exports.removeDocument = (db, doc, collection, cb) => {
  const coll = db.collection(collection);

  coll.deleteOne(doc, (err, res) => {
    assert.equal(err, null);
    console.log(`Removed the document ${doc}`);
    cb(res);
  });
};
