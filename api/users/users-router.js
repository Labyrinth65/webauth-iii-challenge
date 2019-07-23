const router = require("express").Router();

const usersDB = require("./users-model");
const restricted = require("../auth/restricted-middleware");

router.get("/", restricted, async (req, res) => {
	try {
		const users = await usersDB.find();
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "something went wrong." });
	}
});

module.exports = router;
