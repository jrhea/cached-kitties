var express    = require('express');
    bodyParser = require('body-parser');
    cors = require('cors');

var app = express();

// allows CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./swagger'));
app.use(require('./routes'));

// serve api
app.listen( process.env.PORT || 8080, function(){
  console.log('Listening on ' + this.address().address + ':' + this.address().port);
});
