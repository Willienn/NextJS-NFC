import { NFC } from "./src/index";
import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const nfc = new NFC();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(
	cors({
		origin: "*", // Replace with your frontend URL if different
	}),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

nfc.on("reader", (reader) => {
	console.log(`${reader.reader.name}  device attached`);
	reader.aid = "F222222222";

	reader.on("card", (card) => {
		console.log(card);
		io.emit("nfc-card-read", card);
	});

	reader.on("error", (err) => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on("end", () => {
		e.log(`${reader.reader.name}  device removed`);
	});
});

nfc.on("error", (err) => {
	console.log("an error occurred", err);
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

server.listen(3001, () => {
	console.log("Server listening on port 3001");
});

io.on("connection", (socket) => {
	console.log("Client connected");
});
