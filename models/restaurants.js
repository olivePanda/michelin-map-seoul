var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestaurantSchema = new Schema({
    category:   {type: String},
    title:      {type: String},
    img:        {type: String},
    grade:      {type: String},
    homepage:   {type: String},
    address:    {type: String},
    phone:      {type: String},
    lat:        {type: String},
    lon:        {type: String}
});

module.exports = mongoose.model('Restaurants', RestaurantSchema);