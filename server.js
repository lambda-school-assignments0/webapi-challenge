const express = require("express");
const morgan = require("morgan");
const actionRouter = require("./data/routers/actionRouter");
const projectRouter = require("./data/routers/projectRouter");

const server = express();

// global "use" pipeline
server.use(morgan("dev"));
server.use(express.json());
server.use("/api/action", actionRouter);
server.use("/api/project", projectRouter);

server.get("/", (req, res) => {
    res.send(`
        <h2>Sprint Challenge: Express and Node.js - Projects & Actions</h2>
    `);
});

module.exports = server;
