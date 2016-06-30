var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('Homepage', { title: 'Hello, World!' });
});
router.get('/About', function(req, res) {
    res.render('About', { title: 'Hello, World!' });
});
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});
module.exports = router;
