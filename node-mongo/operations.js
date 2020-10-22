const assert = require('assert');

/*exports.insertDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection);
	coll.insert(document, (err, result) => {
		assert.equal(err, null);
		console.log("Inserted " + result.result.n + " documents into the collection " + collection);// n is main how many documents have been inserted
		callback(result);		
	});

};*/
// использование promise
exports.insertDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection);
	/*coll.insert(document, (err, result) => {
		assert.equal(err, null);
		console.log("Inserted " + result.result.n + " documents into the collection " + collection);// n is main how many documents have been inserted
		callback(result);		
	});*/
	return coll.insert(document);

};
exports.findDocuments = (db, collection, callback) => {
	const coll = db.collection(collection);
	return coll.find({}).toArray();
	
};
exports.removeDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection);
	return coll.deleteOne(document);
	
};
exports.updateDocument = (db, document, update, collection, callback) => {
	const coll = db.collection(collection);
	return coll.updateOne(document, {$set: update}, null);
	
};