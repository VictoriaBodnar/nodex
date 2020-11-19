const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');//*
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
var id1, id2;
dishRouter.use(bodyParser.json());


dishRouter.route('/')
.get((req, res, next) => {
	Dishes.find({})
	.populate('comments.author')
	.then((dishes) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dishes);
	}, err => next(err))
	.catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//* 

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
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	Dishes.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, err => next(err))
	.catch((err) => next(err));
});



dishRouter.route('/:dishId')
.get((req, res, next) => {
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
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
	res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
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
.get((req, res, next) => {
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
.post(authenticate.verifyUser, (req, res, next) => {//*
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
.put(authenticate.verifyUser, (req, res, next) => {//*
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes.' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {//*
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
.get((req, res, next) => {
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
.post(authenticate.verifyUser, (req, res, next) => {//*
	res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {//*
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		//req.body.author = req.user._id
		if (dish != null && dish.comments.id(req.params.commentId) != null) {
			//id1 = dish.comments.id(req.params.commentId).author._id; id2 = req.user._id;
			id1 = JSON.stringify(dish.comments.id(req.params.commentId).author._id); id2 = JSON.stringify(req.user._id);
			//if (id1 != id2)  {
			if (!dish.comments.id(req.params.commentId).author.equals(req.user._id)) {	
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
.delete(authenticate.verifyUser, (req, res, next) => {//*
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
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            req.body.author = req.user._id;
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
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyOrdinaryUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
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
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')    
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyOrdinaryUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyOrdinaryUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
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
                }, (err) => next(err));
            } else {
                err = new Error("You are not authorized to perform this operation!");
                err.status = 403;
                return next(err);
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyOrdinaryUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
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
                }, (err) => next(err));
            } else {
                err = new Error("You are not authorized to perform this operation!");
                err.status = 403;
                return next(err);
            }
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;*/