const getData = async () => {
	const response = await fetch("/api");
	const data = await response.json();
	// console.log(data);

	data.map((entry) => {
		const { myLat, myLon, timestamp } = entry;

		const listEl = document.getElementById("positions_list");
		const entryEl = document.createElement("li");
		listEl.appendChild(entryEl);

		const coordsEl = document.createElement("p");
		coordsEl.textContent = `where: `;
		const coordsStrong = document.createElement("strong");
		coordsStrong.textContent = `${myLat}, ${myLon}`;
		coordsEl.append(coordsStrong);

		const timeEl = document.createElement("p");
		const dateString = new Date(timestamp);
		timeEl.textContent = `when: ${dateString}`;

		entryEl.append(coordsEl, timeEl);
	});
};

getData();
