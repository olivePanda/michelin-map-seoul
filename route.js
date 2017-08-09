var express = require('express');
var router = express.Router();
var fs = require('fs');

var dataCrawling = require('./dataCrawling.js');
var Models = require('./models');

router.get('/get_seoul_topojson', function(req, res) {
    var data = JSON.parse(fs.readFileSync('public/data/seoul_municipalities_topo_simple.json', 'utf-8'));
    res.send(data);
});

/*router.get('/get_res_position', function(req,res) {
    Models.Restaurants.find({}, function(err, doc) {
        res.send(doc);
    })
})*/

router.get('/get_res_position', function(req,res) {
    Models.Restaurants.find({'grade' : 'icon-star'}, function(err, doc) {
        res.send(doc);
    })
})

router.get('/', function(req,res) {
    dataCrawling.dataCrawling();
    res.render('index');
})

router.get('/:id', function(req,res) {
    console.log(req.params.id);
})

module.exports = router;