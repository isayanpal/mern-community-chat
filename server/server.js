const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db/db");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.yellow.bold)
);
