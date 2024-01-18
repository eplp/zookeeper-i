const path = require('path');
const router = require('express').Router();


//? GET - Root server route - renders index.html
router.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

//? GET - renders animals.html
router.get('/animals', (req, res) => {
   res.sendFile(path.join(__dirname, './public/animals.html'));
});

//? GET - renders zookeepers.html
router.get('/zookeepers', (req, res) => {
   res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//? Wildcard route
//! MUST be always last route
//*  any route that wasn't previously defined will fall under this request and will receive the homepage as the response.
router.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;
