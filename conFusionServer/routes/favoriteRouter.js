const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');


const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favorites.find({user: req.user._id})
	.populate({ path: 'dishes._id', model: 'Dish' })
	.populate('user')	
	.then((favorites) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorites);
	}, err => next(err))
	.catch((err) => next(err));	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//create the list of favorites 

	Favorites.findOne({user: req.user._id})
	  .then((favorite) => {
		if (favorite != null) {//update favorites=====================================================================================
				
				for (var j = (req.body.length - 1); j >= 0; j--) {
						var flag = 0;
						var el = req.body[j]._id;
					for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
						var el2 = favorite.dishes.id(favorite.dishes[i]._id)._id;
						if (el == el2) { flag = 1;	break; }
					}
					if (flag == 0) { favorite.dishes.push({"_id": req.body[j]._id}); }
				}
				favorite.save()
				.then((favorite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				}, err => next(err));
		
		}//===========================================================================================================================
		else {//create favorites
			Favorites.create({"user": req.user._id, "dishes": req.body})
			.then((favorite) => {
				console.log('Favorite created', favorite);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorite);
			}, err => next(err))
			.catch((err) => next(err));
		}
	}, err => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /favorites.');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
			if (favorite != null) {
				favorite.remove({})
				.then((resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				}, err => next(err));
			}
			else {
				err = new Error('Favorites of the user' + req.user._id + 'not found');
				err.status = 404;
				return next(err);
			}
		}, err => next(err))
		.catch((err) => next(err));	
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, (req, res, next) => {
	res.statusCode = 403;
	res.end('GET operation not supported on /favorites/' + req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOne({user: req.user._id})
	  .then((favorite) => {
		if (favorite != null) {//update favorites=====================================================================================
			if (!favorite.dishes.id(req.params.dishId)) { //in favorites this dish doesn't exists 
				//res.end('This dish will be add into favorites');
				favorite.dishes.push({"_id": req.params.dishId});
				favorite.save()
				.then((favorite) => {
				  	console.log('Favorite updated', favorite);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				}, err => next(err));
			}
			else{// nothing to do, dish already exists
				res.end('This dish already exists in favorites' + favorite.dishes.id(req.params.dishId)._id) ;
			}
		}
		else {//create favorites
			Favorites.create({"user": req.user._id, "dishes": [{"_id": req.params.dishId}]})
			.then((favorite) => {
				console.log('Favorite created', favorite);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorite);
			}, err => next(err))
			.catch((err) => next(err));
		}
	}, err => next(err))
	.catch((err) => next(err));

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
			if (favorite != null) {
				if (favorite.dishes.id(req.params.dishId)) {
									
					favorite.dishes.id(req.params.dishId).remove();
					favorite.save()
					.then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					}, err => next(err));
				}
			}
			else {
				err = new Error('Favorites of the user' + req.user._id + 'not found');
				err.status = 404;
				return next(err);
			}
		}, err => next(err))
		.catch((err) => next(err));	
});

module.exports = favoriteRouter;

