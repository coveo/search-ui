// This file is used for heroku deploy used on pull requests

const express = require('express');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');
app.use(
  bodyParser.text({
    type: 'text/html'
  })
);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  user: 'olamothe',
  database: 'qa'
});

client.connect();

app.set('port', process.env.PORT || 8080);
app.use('/', express.static(__dirname + '/bin'));

app.get('/qa/:pagename', function(request, response) {
  client.query(`SELECT content FROM pages WHERE name LIKE $1 LIMIT 1;`, [request.params.pagename], (err, res) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (res.rowCount == 1) {
      return response.send(res.rows[0].content);
    } else {
      return response.sendStatus(404);
    }
  });
});

app.post('/qa/:pagename', function(request, response) {
  if (request.body && request.headers.authentication == `Bearer ${process.env.UPLOAD_KEY}`) {
    client.query(`SELECT 1 FROM pages WHERE name LIKE $1;`, [request.params.pagename], (err, res) => {
      if (err) {
        response.status(500).send(err.message);
      } else if (res.rowCount == 1) {
        client.query(`UPDATE pages SET content=$1 WHERE name LIKE $2;`, [request.body, request.params.pagename], (err, res) => {
          response.sendStatus(200);
        });
      } else {
        client.query(`INSERT INTO pages (content, name) VALUES ($1, $2);`, [request.body, request.params.pagename], (err, res) => {
          response.sendStatus(200);
        });
      }
    });
  } else {
    response.sendStatus(403);
  }
});

app.get('/', function(request, response) {
  console.log('accessing ' + __dirname + '/bin/Index.html');
  response.sendFile(__dirname + '/bin/Index.html');
});

app.get(/^(.+)$/, function(req, res) {
  console.log('accessing ' + __dirname + req.params[0]);
  res.sendFile(__dirname + req.params[0]);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
