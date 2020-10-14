const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


dishRouter.route('/')
.all((req, res, next) => { //all - все види запросов GET,POST,PUT,DELETE
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();								// означает что дальше будет вызываться другая ф-ция обработки (get,post ...)
})
.get((req, res, next) => {
	res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
	res.end('Will create the dish ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.');
})
.delete((req, res, next) => {
	res.end('Deleting all the dishes!');
});



dishRouter.route('/:dishId')
.all((req, res, next) => { 
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next();								
})
.get((req, res, next) => {
	res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
})
.post((req, res, next) => {
	res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
	res.write('Updating the dish: ' + req.params.dishId + '\n');
	res.end('Will update the dish: ' + req.params.dishId);
})
.delete((req, res, next) => {
	res.end('Deleting the dish:' + req.params.dishId);
});

module.exports = dishRouter;



/*app.get('/dishes/:dishId', (req, res, next) => {
	res.end('Will send details of the dish: ' + req.params.dishId + 'to you!');
});
app.post('/dishes/:dishId', (req, res, next) => {
	res.end('POST operation not supported on /dishes/' + req.params.dishId);
});
app.put('/dishes/:dishId', (req, res, next) => {
	res.write('Updating the dish: ' + req.params.dishId + '\n');
	res.end('Will update the dish: ' + req.params.dishId);
});
app.delete('/dishes/:dishId', (req, res, next) => {
	res.end('Deleting the dish:' + req.params.dishId);
});*/