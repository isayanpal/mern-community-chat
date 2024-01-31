const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db/db");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// middlewares
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());

//Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  //handle chat event
  socket.on("chat message", async (msg, userId) => {
    console.log("Message :", msg);
    const message = new Message({
      user: userId,
      text: msg,
    });
    await message.save();
    io.emit("chat message", msg);
  });
});

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.yellow.bold)
);
