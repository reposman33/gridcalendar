import "rxjs";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import "../style.scss";

const button = document.querySelector(".button");
const fromDate = document.querySelector("#dateFrom");
const toDate = document.querySelector("#dateTo");

/**
 *
 * @description - sometimes a month doesn't start/end with a full week. Since the calendar week is based upon the week array it will only show the days provided. To align & display all days in a week we have to top up the week array with empty values.
 * @param {array} month - a month
 * @returns {array} month - the month array where first and last week have 7 days
 */
const fillWeek = (month) => {
	let firstWeek = month[0];
	let lastWeek = month[month.length - 1];
	firstWeek =
		firstWeek.length > 0 && firstWeek.length < 7
			? // top up week starting from begin
			  new Array(7 - firstWeek.length).fill("").concat(firstWeek)
			: firstWeek;
	month[0] = firstWeek;

	lastWeek =
		lastWeek.length > 0 && lastWeek.length < 7
			? // top up week starting from end
			  lastWeek.concat(new Array(7 - lastWeek.length).fill(""))
			: lastWeek;
	month[month.length - 1] = lastWeek;

	return month;
};

const getMonths = (dateFrom, dateTo) => {
	const day = 24 * 60 * 60 * 1000; //day in millisecs
	const startDate = new Date(dateFrom); // convert to msec so we can add days to it
	let months = [[[]]]; // initialize months array

	// lastMonth = months[months.length - 1];
	// lastWeekInLastMonth = months[months.length - 1][months[months.length - 1].length - 1];
	months[months.length - 1][months[months.length - 1].length - 1].push(startDate);
	const days = (new Date(dateTo) - new Date(dateFrom)) / day + 1;
	for (let i = 1; i < days; i++) {
		const currentDay = new Date(startDate.getTime() + i * day);
		const currentMonth = currentDay.getMonth();
		const dayOfWeek = currentDay.getDay();
		/** get the last day in the nested arrays data object:
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
			months.push([[]]);
		}
		if (dayOfWeek === 0 && months[months.length - 1][months[months.length - 1].length - 1].length !== 0) {
			// add a new week or add a new week to new month (since it contains no weeks)
			months[months.length - 1].push([]);
		}
		months[months.length - 1][months[months.length - 1].length - 1].push(currentDay);
	}
	// top up first and last weeks of each month
	return months.map((month) => fillWeek(month));
};

const source = fromEvent(button, "click").pipe(map((_) => getMonths(dateFrom.value, dateTo.value)));

const showAlarmWindow = (e) => {
	const w = document.querySelector(".alarmWindow");
	w.querySelector(".close").addEventListener("click", (e) => w.classList.add("d-none"));
	w.classList.remove("d-none");
};

const createDaysRow = () => {
	const week = createWeek();
	["sun", "mon", "tue", "wed", "thu", "fri", "sat"].forEach((day) => addDayToWeek(createDay(day), week));
	return week;
};

const createDay = (content, id) => {
	const day = document.createElement("span");
	id && content && day.setAttribute("data-day-id", id);
	day.innerText = content;
	day.addEventListener("click", showAlarmWindow);
	return day;
};

const createWeek = () => {
	const week = document.createElement("div");
	week.setAttribute("class", "week");
	return week;
};

const createMonth = (monthName, year) => {
	const month = document.createElement("div");
	month.setAttribute("class", "month");
	const span = document.createElement("span");
	span.appendChild(document.createTextNode(`${monthName} ${year}`));
	month.appendChild(span);
	return month;
};

const createCalendar = () => {
	const calendar = document.createElement("div");
	calendar.setAttribute("class", "calendar");
	return calendar;
};

const addDayToWeek = (day, week) => week.appendChild(day);

const addWeekToMonth = (week, month) => month.appendChild(week);

const addMonthToCalendar = (month, calendar) => {
	calendar.appendChild(month);
};

const addCalendarToContainer = (calendar) => {
	const container = document.querySelector(".container");
	container.appendChild(calendar);
	return container;
};

source.subscribe((res) => {
	const calendar = document.querySelector(".calendar") || createCalendar();

	res.forEach((month, monthIndex) => {
		const _month = createMonth(
			month[1][0].toLocaleDateString(navigator.language, { month: "long" }),
			month[1][0].getFullYear()
		);
		addWeekToMonth(createDaysRow(), _month);
		month.forEach((week, weekIndex) => {
			const _week = createWeek();
			week.forEach((day, dayIndex) => {
				addDayToWeek(createDay(day ? day.getDate() : "", monthIndex * 100 + weekIndex * 10 + dayIndex), _week);
				addWeekToMonth(_week, _month);
			});
		});
		addMonthToCalendar(_month, calendar);
	});
	addCalendarToContainer(calendar);
});
