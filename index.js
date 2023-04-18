import express from "express";
import fs from "fs";
import Datastore from "@seald-io/nedb";
import weather_API_key from "./weather_API_key.js";

const app = express();
//listen at a port
app.listen(3000, () => {
	console.log("listening at 3000");
});
//serving up files from 'public' folder
app.use(express.static("public"));

app.use(express.json({ limit: "1mb" }));
// initializing a database using NeDB
const database = new Datastore({ filename: "database.db" });
database.loadDatabase();

//sending data from db upon request
app.get("/api", (request, response) => {
	database.find({}, async (err, data) => {
		if (err) {
			console.error(err);
			response.end;
			return;
		} else {
			data = await database.findAsync({}).sort({ timestamp: -1 });
			response.json(data);
		}
	});
});

//adding data generated from client to db
let data;
app.post("/api", async (request, response) => {
	data = request.body;

	data.timestamp = Date.now();

	database.insert(data);
	//RESPONSE
	//you are required to make a response, for example:
	response.json({
		status: "success",
		...data,
	});
});

app.get("/weather/:lat-:lon", async (request, response) => {
	const { lat, lon } = request.params;
	const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${weather_API_key}`;
	const weather_response = await fetch(apiURL);
	const weather_JSON = await weather_response.json();
	console.log(weather_JSON);
	response.json(weather_JSON);
});
