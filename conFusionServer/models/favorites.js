const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var dishesSchema = new Schema({
    id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
});

var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[dishesSchema]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;

