const latitudeEl = document.getElementById("lat");
const longitudeEl = document.getElementById("lon");
const waitEl = document.getElementById("wait");
const map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

if ("geolocation" in navigator) {
	console.log("GEOLOCATION IS AVAILABLE");

	navigator.geolocation.getCurrentPosition(async (position) => {
		// FIRST WE GET CLIENT COORDINATES
		const myLat = position.coords.latitude;
		const myLon = position.coords.longitude;
		// LOAD MAP WITH COORDINATES
		map.setView([myLat, myLon], 15);
		let marker = L.marker([myLat, myLon]).addTo(map);

		try {
			// SEND COORDS TO SERVER TO MAKE API CALL
			const apiURL = `/weather/${myLat}-${myLon}`;
			const weather_response = await fetch(apiURL);
			// GET WEATHER DATA
			const weather_data = await weather_response.json();

			// AND TURN IT INTO A WEATHER REPORT IN DOM
			document.getElementById("city").innerText = weather_data["name"];
			const time = Date.now();
			document.getElementById("time").innerText = new Date(time).toLocaleString(
				"kk-KZ",
				{ timeZoneName: "short" }
			);
			document.getElementById("weather").innerText =
				weather_data["weather"][0]["description"];
			document.getElementById("temp").innerText = Math.floor(
				weather_data["main"]["temp"] - 273.15
			);
			document.getElementById("feels-like").innerText = Math.floor(
				weather_data["main"]["feels_like"] - 273.15
			);
			document.getElementById("wind").innerText = weather_data["wind"]["speed"];

			// WHEN ALL THE DOM IS READY THEN "PLEASE WAIT" MESSAGE DISSAPPERARS
			// AND WEATHER REPORT IS SHOWN
			waitEl.style.display = "none";
			const weatherReportEl = document.getElementById("ready");
			weatherReportEl.style.display = "block";
		} catch (error) {
			console.error(error);
		}

		// YOU CAN LOG A WEATHER REPORT UPON BUTTON CLICK
		const saveLogBtn = document.getElementById("save-log");
		const saveLogFunc = async () => {
			const data = { myLat, myLon };
			const options = {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			};
			const response = await fetch("/api", options);
			console.log("COORDINATES SENT TO SERVER, AWAIT RESPONSE");
			const newData = await response.json();
			console.log("RESPONSE FROM SERVER: ", newData);
		};
		saveLogBtn.addEventListener("click", saveLogFunc);
	});
} else {
	console.log("ERROR GEOLOCATION IS NOT AVAILABLE");
	waitEl.style.display = "block";
	waitEl.innerText =
		"Sorry could not get your weather because geolocation for your device is uavailable.";
}
