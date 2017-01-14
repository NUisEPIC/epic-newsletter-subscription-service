'use strict';

require('./env.js')

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    req.method == 'OPTIONS' ? res.sendStatus(200) : next();
});

var mailchimp = new(require('mailchimp-api')).Mailchimp(process.env.MAILCHIMP_KEY);

app.listen(process.env.PORT || 3000, function(){
    console.log('app listening', process.env.PORT);
});

app.post('/mail/subscribe/', function(req, res) {
    console.log(req.body)
    var listId = '';
    if (req.body.type === 'student') {
        listId = '22ace31740'
    }
    else if (req.body.type === 'alumni') {
        listId = '2543cbd335';
    }
    else if ( req.body.type === 'general') {
        listId = '35c7270ac6'
    }

    mailchimp.lists.subscribe({
        id: listId,
        email: {
            email: req.body.email
        }
    }, (data) => {
        console.log('User subscribed successfully! Look for the confirmation email.');
        res.status(200).send({message: "Success!"})
    }, (error) => {
        console.log(error.code + ": " + error.log);
        res.status(400).send({message: error.code + ": " + error.log})
    });
});

exports = module.exports = app;
