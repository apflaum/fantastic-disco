var pg = require('pg');
var express = require('express');
var app = express();
var cors = require('cors');

pg.defaults.ssl = true;
client = new pg.Client(process.env.DATABASE_URL);
client.connect();
query = client.query('CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, content TEXT)');
query.on('end', function() {
  console.log('db:ready');
});

app.use(cors());
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

app.get('/all', function(req, res) {
  client.query('SELECT * FROM "items" ORDER BY "id" DESC', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/count', function(req, res) {
  client.query('SELECT COUNT(*) FROM "items"', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/', function(req, res) {
  client.query('INSERT INTO "items" (content) VALUES($1)', [req.body], function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.send('true');
    }
  });
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get('/last', function(req, res) {
  client.query('SELECT * FROM "items" ORDER BY "id" DESC LIMIT 10', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app:ready');
});
