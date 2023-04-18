const map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const getData = async () => {
	const response = await fetch("/api");
	const data = await response.json();
	// console.log(data);

	data.map((entry) => {
		const { myLat, myLon, weather_data, time } = entry;
		const dateString = Intl.DateTimeFormat("kk-KZ", {
			weekday: "long",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		}).format(new Date(time));

		// CREATE MAP MARKER FOR THIS ENTRY
		let marker = L.marker([myLat, myLon]).addTo(map);
		marker
			.bindPopup(
				`<b>It felt like ${Math.floor(
					weather_data["main"]["feels_like"]
				)}℃ in ${weather_data["name"]} on ${dateString}</b>`
			)
			.openPopup();

		//CREATE WEATHER REPORT IN DOM FOR THIS ENTRY
		const listEl = document.getElementById("positions_list");
		const entryEl = document.createElement("li");
		listEl.appendChild(entryEl);

		const whereWhenEl = document.createElement("p");
		whereWhenEl.innerText = `Weather in ${weather_data["name"]} at ${dateString}:`;
		whereWhenEl.style.fontWeight = "bold";

		const reportEl = document.createElement("p");
		reportEl.innerText = `Temperature ${Math.floor(
			weather_data["main"]["temp"]
		)}℃ felt like: ${Math.floor(weather_data["main"]["feels_like"])}℃, with ${
			weather_data["weather"][0]["description"]
		}. Wind ${weather_data["wind"]["speed"]} m/sec.`;

		entryEl.append(whereWhenEl, reportEl);
	});

	//LOAD MAP AT LATEST ENTRY LOCATION
	const { myLat, myLon } = data[0];
	map.setView([myLat, myLon], 2);
};

getData();
