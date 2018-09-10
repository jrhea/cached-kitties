var express    = require('express');
    bodyParser = require('body-parser');
    cors = require('cors');

var app = express();

// allows CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//generate Swagger Docs
var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');
var swaggerSpec = require('./swagger');

// serve the swagger.json file
app.get('/swagger/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// serve the swagger.html file
app.get('/swagger', (req, res) => {
  res.sendFile(path.join(__dirname + '/swagger/swagger.html'));
})

//app.use(require('./swagger'));
app.use(require('./routes'));

// serve api
app.listen( process.env.PORT, function(){
  console.log('Listening on ' + this.address().address + ':' + this.address().port);
});

module.exports = app; //for unit tests
