const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, { useUnifiedTopology: true },
                    (err, cli) => {
  assert.equal(err, null);

  console.log("DEBUG: connected to MongoSB server");

  const db = cli.db(dbname);
  const coll = db.collection("dishes");

  coll.insertOne(
    {"name": "Uthapizza", "descritpion": "test"},
    (err, res) => {
      assert.equal(err, null);

      console.log("DEBUG: After Insert:\n", res.ops);

      coll.find({}).toArray((err, docs) => {
        assert.equal(err, null);

        console.log("DEBUG: Found:\n", docs);

        db.dropCollection("dishes", (err, _res) => {
          assert.equal(err, null);
          cli.close();
        });
      });
    });
});
