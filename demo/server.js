var express = require('express');
var fs = require('fs');
var app = express();

var port = process.argv[2] || 3000;

app.use('/search', express.static(__dirname + '/../bin'))
app.use(express.static(__dirname));

app.listen(port, function(){
  console.log('Listening to port: ' + port);
});
