const fs = require('fs');
const path = require('path');

const express = require('express'); //* add package

const { animals } = require('./data/animals.json');

const app = express(); //* assign express to "app" to chain express server methods

//! express.js MIDDLEWARE

//* Middleware to parse incoming(to the server) data
//! Middleware functions can serve many different purposes. Ultimately they allow us to keep our
//! route endpoint callback functions more readable while letting us reuse functionality across
//! routes to keep our code DRY.
//* intercept our POST request before it gets to the callback function. At that point,
//* the data will be run through a couple of functions to take the raw data transferred over
//* HTTP and convert it to a JSON object.
//* The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data
//* and converts it to key / value pairings that can be accessed in the req.body object.The extended: true
//* option set inside the method call informs our server that there may be sub - array data nested in it as well,
//* so it needs to look as deep into the POST data as possible to parse all of the data correctly.
//* The express.json() method we use takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object.
//! Both of the following middleware functions need to be set up every time you create a server that's looking to accept POST data.

app.use(express.urlencoded({ extended: true })); //* parse incoming string or array data
app.use(express.json()); //* parse incoming JSON data

//* Middleware to instruct the server to make certain files readily available and to
//* not gate it behind a server endpoint.
//* provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!

app.use(express.static('public'));

//! *************** end of middleware  *************

const PORT = process.env.PORT || 3001;


//? GET - Root server route - renders index.html
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

//? GET - renders animals.html
app.get('/animals', (req, res) => {
   res.sendFile(path.join(__dirname, './public/animals.html'));
});

//? GET - renders zookeepers.html
app.get('/zookeepers', (req, res) => {
   res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//? Wildcard route
//! MUST be always last route
//*  any route that wasn't previously defined will fall under this request and will receive the homepage as the response. 
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

//! ALWAYS the last express app method
app.listen(PORT, () => {
   console.log(`API server now on port ${PORT}!`);
});
