var express = require('express')
var app = express()

console.log(lwip);

app.set('port', (process.env.PORT || 8080))
app.use('/', express.static(__dirname + '/bin'))


app.get('/', function(request, response) {
  console.log('accessing ' + __dirname + '/bin/Index.html')
  response.sendFile(__dirname + '/bin/Index.html');
})

app.get(/^(.+)$/, function(req, res){
  console.log('accessing ' + __dirname + req.params[0])
     res.sendfile( __dirname + req.params[0]);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
