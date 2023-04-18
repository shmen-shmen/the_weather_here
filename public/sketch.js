const latitudeEl = document.getElementById("lat");
const longitudeEl = document.getElementById("lon");
const waitEl = document.getElementById("wait");

if ("geolocation" in navigator) {
	console.log("GEOLOCATION IS AVAILABLE");

	navigator.geolocation.getCurrentPosition(async (position) => {
		// FIRST WE GET CLIENT COORDINATES
		const myLat = position.coords.latitude;
		const myLon = position.coords.longitude;

		// SEND COORDS TO SERVER TO MAKE API CALL
		const apiURL = `/weather/${myLat}-${myLon}`;
		const weather_response = await fetch(apiURL);
		// GET WEATHER DATA
		const weather_data = await weather_response.json();

		// AND TURN IT INTO A WEATHER REPORT IN DOM
		const cityEl = document.getElementById("city");
		cityEl.innerText = weather_data["name"];

		const timeEL = document.getElementById("time");
		const time = Date.now();
		const time_format_options = { timeZoneName: "short" };
		timeEL.innerText = new Date(time).toLocaleString(
			"kk-KZ",
			time_format_options
		);

		const weatherEl = document.getElementById("weather");
		weatherEl.innerText = weather_data["weather"][0]["description"];

		const tempEl = document.getElementById("temp");
		tempEl.innerText = Math.floor(weather_data["main"]["temp"] - 273.15);

		const feelsLikeEl = document.getElementById("feels-like");
		feelsLikeEl.innerText = Math.floor(
			weather_data["main"]["feels_like"] - 273.15
		);

		const windEl = document.getElementById("wind");
		windEl.innerText = weather_data["wind"]["speed"];

		// WHEN ALL THE DOM IS READY THEN "PLEASE WAIT" MESSAGE DISSAPPERARS
		// AND WEATHER REPORT IS SHOWN
		waitEl.style.display = "none";
		const weatherWrapperEl = document.getElementById("weather-wrapper");
		weatherWrapperEl.style.display = "block";

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
