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

const filterByQuery = (query, animalsArray) => {
   let personalityTraitsArray = [];
   let filteredResults = animalsArray;

   if (query.personalityTraits) {
      if (typeof query.personalityTraits === 'string') {
         personalityTraitsArray = [query.personalityTraits];
      } else {
         personalityTraitsArray = query.personalityTraits;
      }

      personalityTraitsArray.forEach((trait) => {
         filteredResults = filteredResults.filter((animal) => animal.personalityTraits.indexOf(trait) !== -1);
      });
   }
   if (query.diet) {
      filteredResults = filteredResults.filter((animal) => animal.diet === query.diet);
   }
   if (query.species) {
      filteredResults = filteredResults.filter((animal) => animal.species === query.species);
   }
   if (query.name) {
      filteredResults = filteredResults.filter((animal) => animal.name === query.name);
   }
   return filteredResults;
};

const findById = (id, animalsArray) => {
   const results = animalsArray.filter((animal) => animal.id === id)[0];
   return results;
};

const createNewAnimal = (body, animalsArray) => {
   animalsArray.push(body);
   //* using sync version (instead of async writeFile version) due to small file size
   //* __dirname - directory of current file (server.js)
   //* stringify() method
   fs.writeFileSync(path.join(__dirname, './data/animals.json'), JSON.stringify({ animals: animalsArray }, null, 2));
   return body;
};

const validateAnimal = (animal) => {
   if (!animal.name || typeof animal.name !== 'string') {
      return false;
   }
   if (!animal.species || typeof animal.species !== 'string') {
      return false;
   }
   if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
   }
   if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
   }
   return true;
};

//? general API - GET
//* uses req.query
app.get('/api/animals', (req, res) => {
   let results = animals; //* "loads" data (animals) into working variable
   //* req.query - brings all query parameters in
   if (req.query) {
      //* process to get api call results
      results = filterByQuery(req.query, results);
   }
   res.json(results); //* 'returns' api call results
});

//? param API route - GET
//! This route MUST be AFTER the general api route
//* - uses req.params.<property-name> - The req object gives us access to another property for
//* this case, req.params.Unlike the query object, the param object needs to be
//* defined in the route path, with <route>/:<parameterName>.
app.get('/api/animals/:id', (req, res) => {
   const result = findById(req.params.id, animals);
   if (result) {
      res.json(result);
   } else {
      res.sendStatus(400);
   }
});

//? POST
//* uses req.body
app.post('/api/animals', (req, res) => {
   req.body.id = animals.length.toString(); //* creates next id
   //* validates for proper object formatting
   if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted');
   } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
   }
});

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
