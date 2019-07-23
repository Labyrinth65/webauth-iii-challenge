const express = require("express");

const usersDB = require("./users-model");
const authenticate = require("../auth/authenticate-middleware");
const router = express.Router();

// protect /api/users so only clients that provide valid credentials can see the list of users
// read the username and password from the headers instead of the body (can't send a body on a GET request)
router.get("/", authenticate, (req, res) => {
	usersDB
		.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

module.exports = router;
