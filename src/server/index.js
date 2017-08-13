const http = require("http");
const express = require("express");
const babelify = require("express-babelify-middleware");
var browserify = require("browserify-middleware");
const socketIO = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 5000;
const INDEX = path.resolve(__dirname, "../../index.html");

const app = express();

//provide a bundle for the browser exposing `require` for npm package(s)
const shared = ["randomcolor"];
app.get("/js/bundle.js", browserify(shared));

// Serve browserified files on the fly
app.use("/js", babelify("src/browser", { external: shared }));

const server = http.createServer(app);

const io = socketIO(server);
var kafka = require("socket.io-kafka");
const kafkaConnectionString = process.env.KAFKA_URL || "kafka://localhost:9092";
var topicName = process.env.KAFKA_TOPIC || "messages";
if (process.env.KAFKA_PREFIX) {
  topicName = `${process.env.KAFKA_PREFIX}${topicName}`;
}
var kafkaOptions = {
  topic: topicName,
  createTopics: false
};
io.adapter(kafka(kafkaConnectionString, kafkaOptions));

// const brushes = [];

app.get("/", (req, res) => res.sendFile(INDEX));

io.on("connection", socket => {
  socket.on("strokes", strokes => {
    // brush.strokes.push(...strokes);
    socket.broadcast.emit("paint", strokes);
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
