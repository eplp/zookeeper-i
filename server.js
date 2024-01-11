const fs = require('fs');
const path = require('path');

const express = require('express'); //* add package

const { animals } = require('./data/animals.json');

const app = express(); //* assign express to "app" to chain express server methods

//! express.js MIDDLEWARE to parse incoming (to the server) data
//! Middleware functions can serve many different purposes. Ultimately they allow us to keep our
//! route endpoint callback functions more readable while letting us reuse functionality across
//! routes to keep our code DRY.
//* intercept our POST request before it gets to the callback function. At that point,
//* the data will be run through a couple of functions to take the raw data transferred over
//* HTTP and convert it to a JSON object.

app.use(express.urlencoded({ extended: true })); //* parse incoming string or array data
app.use(express.json()); //* parse incoming JSON data

//* The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data
//* and converts it to key / value pairings that can be accessed in the req.body object.The extended: true
//* option set inside the method call informs our server that there may be sub - array data nested in it as well,
//* so it needs to look as deep into the POST data as possible to parse all of the data correctly.

//* The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object.
//! Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.

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

function validateAnimal(animal) {
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
}

//! general API - GET
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

//! param API route - GET

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

//! POST
//* uses req.body
app.post('/api/animals', (req, res) => {
   req.body.id = animals.length.toString(); //* creates next
   if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted');
   } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
   }
});

app.listen(PORT, () => {
   console.log(`API server now on port ${PORT}!`);
});
