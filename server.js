const express = require('express'); //* add package
const { animals } = require('./data/animals.json');

const app = express(); //* assign express to "app" to chain express server methods
const port = 3001;

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
      })
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

app.get('/api/animals', (req, res) => {
   let results = animals;
   if (req.query) {
      results = filterByQuery(req.query, results);
   }
   res.json(results);
});

app.listen(port, () => {
   console.log('***=>   API server now on port:', port);
});
