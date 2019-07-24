const express = require("express");

const userRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router.js");
const setupGlobalMiddleware = require("./setup-middleware.js");

const server = express();

server.get("/", (req, res) => {
	res.send(`<h2>WebAuth II Challenge</h2>`);
});

setupGlobalMiddleware(server);

server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
	console.log(error);
	res.status(500).json({ error: "Data could not be retrieved" });
}

module.exports = server;
