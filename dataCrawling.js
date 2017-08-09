var client = require('cheerio-httpcli');
var urlModule = require('url');
var Models = require('./models');
var mongoose = require('mongoose');
var request = require('request');
var configs = require('./configs.js');

var TARGET_URL = "https://guide.michelin.co.kr/ko/restaurant/";
var param = {};

var list = {};
var idx = 0;

/* Naver Map API v3*/
var client_id = configs.client_id;
var client_secret = configs.client_secret;

var checkUrl = (url) => {
  for (var i in list) {
    if (list[i] == url) {
      return true;
    }
  }
  return false;
}
var crawling = (url) => {
    if(checkUrl(url)) return;
    list[idx++] = url;     
    client.fetch(url, param, function(err, $, res) {
        $('.restaurant-list-item').each(function(idx){
            var data = $(this);
            var img = data.find('img').attr('src');
            data = $(this).find('.restaurant-list-content');
            var category = data.find('.restaurant-list-category').text();
            var title = data.find('.restaurant-list-title').text();
            var grade = data.find('.restaurant-list-michelin').find('i')[0].attribs.class.split(' ')[2];
            var homepage = data.find('.restaurant-list-title').find('a')[0].attribs.href;
            var address = data.find('.restaurant-list-info').find('p').children()[0].next.data.trim();
            var phone = data.find('.restaurant-list-info').find('p').children()[1].next.data.trim();

            var restaurant = new Models.Restaurants({
                category:   category,
                title:      title,
                img:        img,
                grade:      grade,
                homepage:   homepage,
                address:    address,
                phone:      phone
            });

            Models.Restaurants.find({title: title}, function(err, found) {
                if(err) {throw err;}

                if(found == 0) {
                    restaurant.save(function(err, result){
                        getGeocodeByNaver(restaurant);
                    })
                } 
            })
            
        });
        
        $('.step').each(function(idx) {
            var url = $(this).attr('href');
            
            crawling(url);
        });
    })
}

var getGeocodeByNaver = (doc) => {
    var api_url = 'https://openapi.naver.com/v1/map/geocode?query=' + encodeURI(doc.address);
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    }
    request.get(options, function(error, response, body) {
        if (JSON.parse(body).result !== undefined) {
            var data = JSON.parse(body).result.items[0];
            doc.lat = data.point.y;
            doc.lon = data.point.x;
            doc.save();
        }
    })
}

exports.dataCrawling = () => {
    crawling(TARGET_URL);
}