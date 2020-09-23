const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, { useUnifiedTopology: true })
.then((cli) => {
  console.log("DEBUG: connected to MongoSB server");

  const db = cli.db(dbname);

  // Create
  dbOper.insertDocument(
    db,
    { name: "Vadonut", description: "Test"},
    "dishes")
    .then((res) => {
      console.log("Insert Document:\n", res.ops);

      // Read
      return dbOper.findDocuments(db, "dishes");
    })
    .then((docs) => {
      console.log("Found Documents:\n", docs);

      // Update
      return dbOper.updateDocument(
        db,
        { name: "Vadonut" },
        { description: "Updated Test" }, "dishes");
    })
    .then((res) => {
      console.log("==> Updated Document:\n", res.result);

      // Read
      return dbOper.findDocuments(db, "dishes");
    })
    .then((docs) => {
      console.log("Found Updated Documents:\n", docs);

      // Delete
      return db.dropCollection("dishes");
    })
    .then((res) => {
      console.log("Dropped Collection: ", res);
      return cli.close();
    })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));
