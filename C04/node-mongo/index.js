const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(
  url,
  { useUnifiedTopology: true },
  (err, cli) => {
    assert.equal(err, null);

    console.log("DEBUG: connected to MongoSB server");

    const db = cli.db(dbname);

    // Nested structure of callbacks...

    // Create
    dbOper.insertDocument(
      db,
      { name: "Vadonut", description: "Test"},
      "dishes", (res) => {
        console.log(`Insert Document:\n ${res.ops}`);

        // Read
        dbOper.findDocuments(db, "dishes", (docs) => {
          console.log("Found Documents:\n", docs);

          // Update
          dbOper.updateDocument(
            db,
            { name: "Vadonut" },
            { description: "Updated Test" }, "dishes",
            (res) => {
              console.log("==> Updated Document:\n", res.result);

              // Read
              dbOper.findDocuments(
                db,
                "dishes",
                (docs) => {
                  console.log("Found Updated Documents:\n", docs);

                  // Delete
                  db.dropCollection(
                    "dishes",
                    (res) => {
                      console.log("Dropped Collection: ", res);
                      cli.close();
                    });
                });
            });
        });
      });

});
