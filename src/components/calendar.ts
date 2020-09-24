import { AlarmManager } from "./alarmManager";
import { TDay } from "../models";
import { Day } from "./day";

class Calendar {
	todaysDate: number = new Date().getDate();
	todaysMonth: number = new Date().getMonth();
	AlarmManager: AlarmManager;
	constructor() {
		this.AlarmManager = new AlarmManager();
	}

	// button 'Go!' to show calendar from chosen period

	// GetMonths utility functions
	/**
	 *
	 * @description - sometimes a month doesn't start/end with a full week. Since the calendar week is based upon the week array it will only show the days provided. To align & display all days in a week we have to top up the week array with empty values.
	 * @param {array} month - a month
	 * @returns {array} month - the month array where first and last week have 7 days
	 */
	fillWeek = (month: Day[][]) => {
		let firstWeek = month[0];
		let lastWeek = month[month.length - 1];
		firstWeek =
			firstWeek.length > 0 && firstWeek.length < 7
				? // top up week starting from begin
				  new Array(7 - firstWeek.length).fill(new Day()).concat(firstWeek)
				: firstWeek;
		month[0] = firstWeek;

		lastWeek =
			lastWeek.length > 0 && lastWeek.length < 7
				? // top up week starting from end
				  lastWeek.concat(new Array(7 - lastWeek.length).fill(new Day()))
				: lastWeek;
		month[month.length - 1] = lastWeek;

		return month;
	};

	// calculate DATA model for calendar - an array of Day objects

	getMonths = (year: number): Day[][][] => {
		const day = 24 * 60 * 60 * 1000; //day in millisecs
		const dateFrom = `${year}-01-01`;
		const dateTo = `${year}-12-31`;
		const startDate: Day = new Day(new Date(dateFrom)); // convert to msec so we can add days to it
		let months: Day[][][] = [[[startDate]]]; // initialize months array
		const days: number = (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / day + 1;
		for (let i = 1; i < days; i++) {
			const currentDay = new Day(new Date(startDate.getTime() + i * day));
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
		return months.map((month: Day[][]) => this.fillWeek(month));
	};

	// Create the DOM model of the Calendar - divs, spans etc

	createDaysRow = () => {
		const week = this.createWeek();
		["sun", "mon", "tue", "wed", "thu", "fri", "sat"].forEach((day) =>
			this.addDayToWeek(this.createDayNames(day), week)
		);
		return week;
	};

	createDayNames = (dayName: string): HTMLSpanElement => {
		const day = document.createElement("span");
		day.innerText = dayName;
		return day;
	};

	createDay = (Day: Day): HTMLSpanElement => {
		const day = document.createElement("span");
		day.setAttribute("data-day-id", Day.getDateId());
		day.innerText = Day.getDate() !== -1 ? Day.getDate() + "" : "";
		day.classList.toggle("selected", this.todaysMonth === Day.getMonth() && this.todaysDate === Day.getDate());
		day.addEventListener("click", () => this.AlarmManager.showAlarmWindow(Day.getDateId(), Day.getDate()));
		return day;
	};

	createWeek = (): HTMLDivElement => {
		const week = document.createElement("div");
		week.setAttribute("class", "week");
		return week;
	};

	createMonth = (monthName: string, year: number): HTMLDivElement => {
		const month = document.createElement("div");
		month.setAttribute("class", "month");
		const span = document.createElement("span");
		span.appendChild(document.createTextNode(`${monthName} ${year}`));
		month.appendChild(span);
		return month;
	};

	createCalendar = (): HTMLDivElement => {
		const calendar = document.createElement("div");
		calendar.setAttribute("class", "calendar");
		return calendar;
	};

	// Calendar concatenate DOM element functions

	addDayToWeek = (day: HTMLSpanElement, week: HTMLDivElement) => week.appendChild(day);

	addWeekToMonth = (week: HTMLDivElement, month: HTMLDivElement) => month.appendChild(week);

	addMonthToCalendar = (month: HTMLDivElement, calendar: HTMLDivElement) => {
		calendar.appendChild(month);
	};

	addCalendarToContainer = (calendar: HTMLDivElement) => {
		const container = document.querySelector(".container");
		container.appendChild(calendar);
		return container;
	};
}

export { Calendar };
