const bcrypt = require("bcryptjs"); /// <<<<<< install it and require it

const usersDB = require("../users/users-model");

function authenticate(req, res, next) {
	const { username, password } = req.headers;

	// find the users in the DB
	usersDB
		.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				next(); // pressing the button to let the request continue
			} else {
				res.status(401).json({ message: "You shall not pass!!" });
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
}

module.exports = authenticate;
