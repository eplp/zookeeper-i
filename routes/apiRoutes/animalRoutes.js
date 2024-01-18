const router = require('express').Router();  //* replaces app. with router.


const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');



//? general API - GET
//* uses req.query
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
   const result = findById(req.params.id, animals);
   if (result) {
      res.json(result);
   } else {
      res.sendStatus(404);
   }
});

//? POST
//* uses req.body
router.post('/animals', (req, res) => {
   req.body.id = animals.length.toString(); //* creates next id
   //* validates for proper object formatting
   if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted');
   } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
   }
});

module.exports = router;