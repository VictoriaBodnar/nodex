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
	.populate('dishes.id')
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
	
	/*Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if (favorite != null) {
			//res.end('=======not null=========');
			Favorite.remove({})
			.then((resp) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, err => next(err))
		.catch((err) => next(err));

		}
	});*/
	//Dishes.findById(req.params.dishId)
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Favorites.findOne({user: req.user._id})
		.then((favorite) => {
			if (favorite != null) {
				for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
					dish.comments.id(dish.comments[i]._id).remove();
					favorite.dishes.id(req.params.dishId)._id
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

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, (req, res, next) => {

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
			else{
				res.end('*********This dish already exists in favorites***********' + favorite.dishes.id(req.params.dishId)._id) ;
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

});

module.exports = favoriteRouter;

//mongoose find in array of objects
//https://stackoverflow.com/questions/22806326/mongoose-mongodb-querying-an-array-of-objects



	
	/*


	Favorites.create({"user": req.user._id, "dishes": [{"dish": req.params.dishId}]})
	.then((favorite) => {
		res.end('***********' + req.params.dishId + '*************' + favorite.id);///YES
		console.log('Favorite created', favorite);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorite);
	}, err => next(err))
	.catch((err) => next(err));*/

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	