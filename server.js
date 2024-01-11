const express = require('express'); //* add package
const { animals } = require('./data/animals.json');

const app = express(); //* assign express to "app" to chain express server methods
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
         filteredResults = filteredResults.filter((animal) => {
            animal.personalityTraits.indexOf(trait) !== -1;
         });
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

//! general API - GET
//todo - uses req.query
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

app.listen(PORT, () => {
   console.log(`API server now on port ${PORT}!`);
});
