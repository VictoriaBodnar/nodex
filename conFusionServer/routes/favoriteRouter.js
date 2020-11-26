const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');//*
const cors = require('./cors');
//const Dishes = require('../models/dishes');

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	//res.end('----'+req.user._id+'---');
	Favorites.find({user: req.user._id})
	.populate('dishes.dish')
	.populate('user')	
	.then((favorites) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorites);
	}, err => next(err))
	.catch((err) => next(err));	
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//* 

	Favorites.create(req.body)
	.then((favorite) => {
		//favorite.user.id = req.user._id;//присвоить ид тек.пользователя которій создает фаворитов
		var err = new Error('****' + req.user._id + '***');
		return next(err);
		//favorite.dishes.dish.id = req.body._id;//присвоить ид блюда фаворита
		if (req.body) {
			favorite.dishes.push(req.body);
		}
		console.log('Favorite created', favorite);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorite);
	}, err => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	/*res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.');*/
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//*
	/*Dishes.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, err => next(err))
	.catch((err) => next(err));*/
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, (req, res, next) => {

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	//res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.find({user: req.user._id})
	//.populate('dishes.dish')
	//.populate('user')
	.then((favorite) => {
		if (favorite != null) {//update favorites=====================================================================================
			console.log('Favorite @@@@@', favorite);
			//dish.comments.id(req.params.commentId).author._id//ЄТО ВІВОДИТСЯ
			//favorite.dishes.id(req.params.dishId).dish._id
						
			res.end('***********' + req.params.dishId + '*************' + favorite);//dish.comments.id(req.params.commentId).author//favorite.dishes.id(req.params.dishId).dish._id
			/*req.body.author = req.user._id
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
				
			}, err => next(err));*/
		}
		else {//create favorites
			Favorites.create({"user": req.user._id, "dishes": [{"dish": req.params.dishId}]})
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	
});

module.exports = favoriteRouter;






	/*Favorites.create({"user": req.user._id, "dishes": [{"dish": req.params.dishId}]})
	.then((favorite) => {
		console.log('Favorite created', favorite);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorite);
	}, err => next(err))
	.catch((err) => next(err));*/