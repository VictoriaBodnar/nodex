const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');//*
const cors = require('./cors');

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})//preflight
.get(cors.cors, (req, res, next) => {
	Favorites.find({})
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
		favorite.user.id = req.user._id;//присвоить ид тек.пользователя которій создает фаворитов
		if (req.body.rating) {
				dish.comments.id(req.params.commentId).rating = req.body.rating;
			}
			if (req.body.comment){
				dish.comments.id(req.params.commentId).comment = req.body.comment;
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