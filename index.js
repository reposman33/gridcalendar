const { fromEvent } = rxjs;
const { map } = rxjs.operators;

const button = document.querySelector(".btn");

const fromDate = document.querySelector("#dateFrom");
const toDate = document.querySelector("#dateTo");

const getMonths = (dateFrom, dateTo) => {
	const day = 24 * 60 * 60 * 1000; //day in millisecs
	const start = new Date(dateFrom); // convrt to msec so we can add days to it
	const months = [[[new Date(dateFrom)]]]; // initialize months array
	const days = (new Date(dateTo) - new Date(dateFrom)) / day + 1;
	for (let i = 1; i < days; i++) {
		const currentDay = new Date(start.getTime() + i * day);
		const currentMonth = currentDay.getMonth();
		const dayOfWeek = currentDay.getDay();
		/** get the lasty day in the nested arrays datao object
		 *
		 *  lastMonth = months[months.length-1];
		 * lastWeek = lastMonth[lastMonth.length-1]
		 * lastDay = lastWeek[lastWeek.length-1]
		 * lastDay = months[months.length-1][months[months.length-1].length-1][months[months.length-1][months[months.length-1].length-1].length-1]
		 */
		// compare currentDay with the last day
		const lastDay =
			months[months.length - 1][months[months.length - 1].length - 1][
				months[months.length - 1][months[months.length - 1].length - 1].length - 1
			];
		if (lastDay.getMonth() !== currentMonth) {
			// add a new month to months
			months.push([]);
		}
		if (dayOfWeek === 0 || months[months.length - 1].length === 0) {
			// add a new week or add a new week to new month (since it contains no weeks)
			months[months.length - 1].push([]);
		}
		months[months.length - 1][months[months.length - 1].length - 1].push(currentDay);
	}
	console.log(months);

	//return monnths;
};

const container = document.getElementById("container");

const addTable = () => {
	table = document.createElement("table");
	container.appendChild(table);
	return table;
};

const source = fromEvent(button, "click").pipe(map((_) => getMonths(dateFrom.value, dateTo.value)));

source.subscribe((res) => {
	// const months = res.forEach((month) => {
	// 	// for each month
	// 	//	if dayOfWeek === 6
	// 	//		add week to month;
	// 	//		make new empty week array
	// 	//	add day to week
	// });
});
