const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

//MongoClient.connect(url, (err, client) => {
MongoClient.connect(url).then((client) => {

	console.log('Connected correctly to server');
	const db = client.db(dbname);

	dboper.insertDocument(db, {name: "Vadonut", description: 'Test'} , 'dishes')
	.then((result) => {
		console.log('Insert Document:\n', result.ops); //ops gives number of insert operations (will looks like this: { n: 1, nModified: 1, ok: 1 }


		return dboper.findDocuments(db, 'dishes')
	})
	.then((docs) => {
			console.log('Found documents:\n', docs);

			return dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Test'}, 'dishes')
	})		

	.then((result) => {

			console.log('Updated document:\n', result.result);
			return dboper.findDocuments(db, 'dishes')
	})
	.then((docs) => {
		
			console.log('Found documents:\n', docs);
			return db.dropCollection('dishes')
	})
	.then((result) => {

			console.log('Dropped collection: ', result);

			client.close();

	})
	.catch((err) => console.log(err));
})
.catch((err) => console.log(err));

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
