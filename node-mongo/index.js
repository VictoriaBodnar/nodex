const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {

	assert.equal(err, null);
	console.log('Connected correctly to server');
	const db = client.db(dbname);

	dboper.insertDocument(db, {name: "Vadonut", description: 'Test'} , 'dishes', (result) => {
		console.log('Insert Document:\n', result.ops); //ops gives number of insert operations (will looks like this: { n: 1, nModified: 1, ok: 1 }


		dboper.findDocuments(db, 'dishes', (docs) => {
			console.log('Found documents:\n', docs);

			dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Test'}, 'dishes', (result) => {

				console.log('Updated document:\n', result.result);
				dboper.findDocuments(db, 'dishes', (docs) => {
					console.log('Found documents:\n', docs);

					db.dropCollection('dishes', (result) => {

						console.log('Dropped collection: ', result);

						client.close();

					});
				});	
			});

		});
	});

	//It is the first exercise, wich was replaced by module operations.js from exercise 2
	/*const collection = db.collection('dishes');
		collection.insertOne({"name": "Uthapizza", "description": "Test"}, (err, result) => {
		assert.equal(err, null);
		
		console.log('After insert:\n');
		console.log(result.ops);
		collection.find({}).toArray((err, docs) => {
			assert.equal(err, null);

			console.log('Found:\n');
			console.log(docs); // docs contain all the documents of collection

			db.dropCollection('dishes', (err, result) =>{
				assert.equal(err, null);

				client.close();

			});

		});
	});*/ 
});