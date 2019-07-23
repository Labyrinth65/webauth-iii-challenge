const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs"); /// <<<<<< install it and require it

const usersDB = require("./users/users-model");
const userRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
	res.send(`<h2>WebAuth I Challenge</h2>`);
});

server.post("/api/register", async (req, res) => {
	try {
		if (req.body.username && req.body.password) {
			const hash = bcrypt.hashSync(req.body.password, 8);
			req.body.password = hash;
			const user = await usersDB.add(req.body);
			res.status(201).json(user);
		} else {
			res
				.status(400)
				.json({ message: "please provide username and password." });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "something went wrong." });
	}
});

server.post("/api/login", async (req, res) => {
	try {
		let { username, password } = req.body;
		const user = await usersDB.findBy({ username }).first();
		if (user && bcrypt.compareSync(password, user.password)) {
			res.status(200).json({ message: `Welcome ${user.username}!` });
		} else {
			res.status(401).json({ message: "Invalid Credentials" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "something went wrong." });
	}
});

server.use(express.json());

server.use("/api/users", userRouter);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
	console.log(error);
	res.status(500).json({ error: "Data could not be retrieved" });
}

module.exports = server;
