const router = require("express").Router();
const bcrypt = require("bcryptjs");

const usersDB = require("../users/users-model.js");

// for endpoints beginning with /api/auth
router.post("/register", async (req, res) => {
	try {
		const checkUser = await usersDB.findBy(req.body.username);
		console.log(checkUser);
		if (!req.body.username || !req.body.password) {
			res
				.status(400)
				.json({ message: "please provide username and password." });
		} else if (checkUser && req.body.username === checkUser.username) {
			res.status(401).json({
				message: "username is already in use, please provide another"
			});
		} else {
			const hash = bcrypt.hashSync(req.body.password, 10);
			req.body.password = hash;
			const user = await usersDB.add(req.body);
			res.status(201).json(user);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "something went wrong." });
	}
});

router.post("/login", async (req, res) => {
	try {
		if (!req.body.username || !req.body.password) {
			res
				.status(400)
				.json({ message: "please provide username and password." });
		}
		let { username, password } = req.body;
		const user = await usersDB.findBy(username);
		if (user && bcrypt.compareSync(password, user.password)) {
			req.session.username = user.username; // 4 ******** add data to session
			res.status(200).json({ message: `Welcome ${user.username}!` });
		} else {
			res.status(401).json({ message: "Invalid Credentials" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "something went wrong." });
	}
});

router.get("/logout", (req, res) => {
	if (req.session) {
		// here we logout
		req.session.destroy(err => {
			if (err) {
				res.status(500).json({
					message: "something went wrong"
				});
			} else {
				res.status(200).json({ message: "Logout successful" });
			}
		});
	} else {
		res.status(200).json({ message: "Logout successful" });
	}
});

module.exports = router;
