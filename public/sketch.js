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
		try {
			// SEND COORDS TO SERVER TO MAKE API CALL
			const apiURL = `/weather/${myLat}-${myLon}`;
			const weather_response = await fetch(apiURL);
			// GET WEATHER DATA
			const weather_data = await weather_response.json();
			// console.log(weather_data);

			// AND TURN IT INTO A WEATHER REPORT IN DOM
			const time = Date.now();
			const dateString = ("time".innerText = Intl.DateTimeFormat("kk-KZ", {
				weekday: "long",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
			}).format(new Date(time)));

			document.getElementById(
				"where-when"
			).innerText = `${weather_data["name"]} ${dateString}.`;

			document.getElementById(
				"report"
			).innerText = `Right now it is ${Math.floor(
				weather_data["main"]["temp"]
			)}℃ which feels like: ${Math.floor(
				weather_data["main"]["feels_like"]
			)}℃ outside, with ${
				weather_data["weather"][0]["description"]
			}. The wind is ${weather_data["wind"]["speed"]} m/sec.`;

			// WHEN ALL THE DOM IS READY THEN "PLEASE WAIT" MESSAGE DISSAPPERARS
			// AND WEATHER REPORT IS SHOWN
			waitEl.style.display = "none";
			const weatherReportEl = document.getElementById("ready");
			weatherReportEl.style.display = "block";

			// LOAD MAP WITH CLIENT COORDINATES AND ADD MARKER
			map.setView([myLat, myLon], 15);
			let marker = L.marker([myLat, myLon]).addTo(map);
			marker
				.bindPopup(
					`<b>Feels like ${Math.floor(
						weather_data["main"]["feels_like"]
					)}℃ here</b>`
				)
				.openPopup();

			// YOU CAN LOG A WEATHER REPORT UPON BUTTON CLICK
			const saveLogBtn = document.getElementById("save-log");
			const saveLogFunc = async () => {
				const data = { myLat, myLon, weather_data, time };
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
		} catch (error) {
			console.error(error);
		}
	});
} else {
	console.log("ERROR GEOLOCATION IS NOT AVAILABLE");
	waitEl.style.display = "block";
	waitEl.innerText =
		"Sorry could not get your weather because geolocation for your device is uavailable.";
}
