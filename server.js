// set up -----------------------

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// Set PORT
var port = process.env.PORT || 8080;


// configuration ------------------

mongoose.connect('mongodb://joshiatt:joshiatt@ds111851.mlab.com:11851/todoapp');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

// define model --------------------------------

var Todo = mongoose.model('Todo', {
    text: String
});


// routes --------------------------------------


        // api ------------------------------------------------
        // get all todos
        app.get('/api/todos', function(req, res) {

            // use mongoose to get all todos in the database
            Todo.find(function(err, todos) {

                // if there is an error retrieving, send the error.nothing after res.send(err) is exdecuted
                if (err)
                    res.send(err);

                res.json(todos); // return all todos in json format
            });
        });

        // create a todo and send back all todo after creation
        app.post('/api/todos', function(req, res) {

            // create a todo, information comes from AJAX request from Angular
            Todo.create({
                text: req.body.text,
                done: false
            }, function(err, todo) {
                if (err)
                    res.send(err);

                    // get and return all the todos after you create another
                    Todo.find(function(err, todos) {
                        if (err)
                            res.send(err);
                        res.json(todos);
                    });

                });
        
            });


            // delete a todo
            app.delete('/api/todos/:todo_id', function(req, res) {
                Todo.remove({
                    _id : req.params.todo_id
                }, function(err, todo) {
                    if (err)
                        res.send(err);

                        // get and return all the todos after you delete one
                        Todo.find(function(err, todos) {
                            if (err)
                                res.send(err);
                            res.json(todos);
                        });
                });
            });


            // application -----------------------------------------
            app.get('*', function(req, res) {
                res.sendfile('./public/index.html'); 
            });





// listen (start app with node server.js) -------------------------

app.listen(port);
console.log("App listening on port 8080");