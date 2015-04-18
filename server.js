var express = require('express');
var http = require('http');
var port = process.env.PORT || 5000

var staticDir = __dirname + '/dist'

var app = module.exports = express();

app.use(express.static(staticDir));

var server = http.createServer(app)
server.listen(port, function() {
  console.log('Server listening on port ' + port);
});
