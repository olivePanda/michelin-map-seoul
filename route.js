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
    Models.Restaurants.find({}, function(err, doc) {
        res.send(doc);
    })
})

router.post('/get_test_position', function(req,res) {
    var category = req.body.category;
    var grade = replaceGrade(req.body.grade);

    if (category =='' && grade == '') {
        Models.Restaurants.find({}, function(err, doc) {
            res.send(doc);
        })
    } else if (category =='' && grade != '') {
        Models.Restaurants.find({'grade' : grade}, function(err, doc) {
            res.send(doc);
        })
    } else if (category !='' && grade == '') {
        Models.Restaurants.find({'category': category}, function(err, doc) {
            res.send(doc);
        })
    } else {
        Models.Restaurants.find({'category': category, 'grade' : grade}, function(err, doc) {
            res.send(doc);
        })
    }
})

router.get('/', function(req,res) {
    dataCrawling.dataCrawling();

    var viewModel = {
        categorys : {}
    }
    Models.Restaurants.distinct('category', function(err, doc) {
        viewModel.categorys = doc;
        res.render('index', viewModel);
    })
})

router.get('/:id', function(req,res) {
    console.log(req.params.id);
})


function replaceGrade(grade) {
    if (grade == '★★★') {
        return 'icon-star3'
    } else if (grade == '★★') {
        return 'icon-star2'
    } else if (grade == '★') {
        return 'icon-star'
    } else if ((grade == '빕구르망')) {
        return 'icon-bib-gourmand';
    } else {
        return 'icon-others';
    }
}

module.exports = router;