const latitudeEl = document.getElementById("lat");
const longitudeEl = document.getElementById("lon");
const submitBtnEl = document.getElementById("submit_btn");

if ("geolocation" in navigator) {
	console.log("GEOLOCATION IS AVAILABLE");

	navigator.geolocation.getCurrentPosition((position) => {
		const myLat = position.coords.latitude;
		latitudeEl.innerText = myLat;
		const myLong = position.coords.longitude;
		longitudeEl.innerText = myLong;

		const dataExchangeSequence = async () => {
			const data = { myLat, myLong };

			//  hey, I want:
			//  1 this data to be sent as JSON
			//  2 I tell you this is JSON
			//  2 I want to post it to '/api'
			const options = {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			};
			//OMG here i make a request to a server and then i log response
			//So this is what it means
			const response = await fetch("/api", options);
			console.log("COORDINATES SENT TO SERVER, AWAIT RESPONSE");
			const newData = await response.json();
			console.log("RESPONSE FROM SERVER: ", newData);
		};

		submitBtnEl.addEventListener("click", dataExchangeSequence);
	});
} else {
	console.log("ERROR GEOLOCATION IS NOT AVAILABLE");
	latitudeEl.innerText = "*******";
	longitudeEl.innerText = "*******";
	sendBtnEl.innerText = "GEO DATA NOT AVAILABLE";
}
