const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');//*
const cors = require('./cors');

const Dishes = require('../models/dishes');
const dishRouter = express.Router();
var id1, id2;
dishRouter.use(bodyParser.json());


dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, (req, res, next) => {
	Dishes.find({})
	.populate('comments.author')
	.then((dishes) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dishes);
	}, err => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//* 

	//res.end('Will create the dish ' + req.body.name + ' with details: ' + req.body.description);
	Dishes.create(req.body)
	.then((dish) => {
		console.log('Dish created', dish);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	}, err => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	Dishes.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, err => next(err))
	.catch((err) => next(err));
});



dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) => {
		console.log('Dish created', dish);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	}, err => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	res.end('POST operation not supported on /dishes/' + req.params.dishId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	Dishes.findByIdAndUpdate(req.params.dishId, {
		$set: req.body
	}, {new: true})
	.then((dish) => {
		console.log('Dish created', dish);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	}, err => next(err))
	.catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, err => next(err))
	.catch((err) => next(err));
});

//////////////////////
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) => {
		if (dish != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments);
		}
		else {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		
	}, err => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	//res.end('Will create the dish ' + req.body.name + ' with details: ' + req.body.description);
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null) {
			req.body.author = req.user._id
			dish.comments.push(req.body);
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
					.populate('comments.author')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);	
					})
				
			}, err => next(err));
		}
		else {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		
	}, err => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.' + req.params.dishId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null) {
			for (var i = (dish.comments.length - 1); i >= 0; i--) {
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			}, err => next(err));
		}
		else {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, err => next(err))
	.catch((err) => next(err));
});



dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) => {
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments.id(req.params.commentId));
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, err => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
//************************************************************************************************************************
/*.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		//req.body.author = req.user._id
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
<<<<<<< HEAD
			//id1 = dish.comments.id(req.params.commentId).author._id; id2 = req.user._id;
			id1 = JSON.stringify(dish.comments.id(req.params.commentId).author._id); id2 = JSON.stringify(req.user._id);
			//if (id1 != id2)  {
			if (!dish.comments.id(req.params.commentId).author.equals(req.user._id)) {	
				//var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! '+ typeof(id1) + '*******' + typeof(id2));
				var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! ');
=======
			//if (dish.comments.id(req.params.commentId).author._id != req.user._id)  {///Id1.equals(id2)
				var ff = dish.comments.id(req.params.commentId).author._id;
			//if (ff.equals(req.user._id))  {
				if (ff != req.user._id)  {
				//dish.comments.push(req.body);
				if (req.body.rating) {
					dish.comments.id(req.params.commentId).rating = req.body.rating;
				}
				if (req.body.comment){
					dish.comments.id(req.params.commentId).comment = req.body.comment;
				}
				dish.save()
				.then((dish) => {
					Dishes.findById(dish._id)
					.populate('comments.author')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					})
					
				}, err => next(err));
			}
				var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! ' + req.user._id + '*******' + dish.comments.id(req.params.commentId).author._id );
>>>>>>> 51f9ec79e349f47baf42aba8cc7b54873f335a42
		        err.status = 403;
		        return next(err);
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, err => next(err))
	.catch((err) => next(err));
})*/
//*********************************************************************************************************************************************
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		//req.body.author = req.user._id
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			//id1 = dish.comments.id(req.params.commentId).author._id; id2 = req.user._id;
			id1 = JSON.stringify(dish.comments.id(req.params.commentId).author._id); id2 = JSON.stringify(req.user._id);
			//if (!dish.comments.id(req.params.commentId).author.equals(req.user._id)) {// the right way of checking
			if (id1 != id2)  {
				//var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! '+ typeof(id1) + '*******' + typeof(id2));
				var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! ');
		        err.status = 403;
		        return next(err);
			}
			//dish.comments.push(req.body);
			if (req.body.rating) {
				dish.comments.id(req.params.commentId).rating = req.body.rating;
			}
			if (req.body.comment){
				dish.comments.id(req.params.commentId).comment = req.body.comment;
			}
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
				.populate('comments.author')
				.then((dish) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish);
				})
				
			}, err => next(err));
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, err => next(err))
	.catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			id1 = JSON.stringify(dish.comments.id(req.params.commentId).author._id); id2 = JSON.stringify(req.user._id);
			if (id1 != id2)  {
				//var err = new Error('You are not allowed to perform this operation! Only the author of comment can makes the changes! '+ typeof(id1) + '*******' + typeof(id2));
				var err = new Error('You are not allowed to perform this operation! Only the author can delete this comment! ');
		        err.status = 403;
		        return next(err);
			}

			dish.comments.id(req.params.commentId).remove();
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
				.populate('comments.author')
				.then((dish) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish);
				})
			}, err => next(err));
		}
		else if (dish == null) {
			err = new Error('Dish' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment' + req.params.commentId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, err => next(err))
	.catch((err) => next(err));
});

module.exports = dishRouter;


