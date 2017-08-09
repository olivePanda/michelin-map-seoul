var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var moment = require('moment');
var mongoose = require('mongoose');

var configs = require('./configs.js');
var route = require('./route.js');

app.set('views', __dirname + '/views');  
app.engine('handlebars',exphbs.create({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts',
    partialsDir: app.get('views') + '/partials',
    helpers: {
        timeago: function(timestamp) {
            console.log(timestamp);
            return moment(timestamp).startOf('minute').fromNow();
        }
    }
}).engine);
app.set('view engine', 'handlebars');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);
app.use('/', route);

app.use('/public/', express.static(path.join(__dirname, 'public')));

/* mongodb */
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };      
//mongoose.connection.openUri('mongodb://localhost/michelinSeoul');
mongoose.connection.openUri('mongodb://'+configs.dbUser+':'+configs.dbpassword+'@ds047075.mlab.com:47075/'+configs.dbName);
mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});

app.listen(app.get('port'), function() {
    console.log('Socket IO server listening on port 3000');
});