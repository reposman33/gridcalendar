import "rxjs";
import { fromEvent, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AlarmManager } from "./components/alarmManager";
import { Calendar } from "./components/calendar";
import { Day } from "./components/day";

import "../style.scss";

// ============ ALARM WINDOW ============

// ============ CALENDAR ============
class Main {
	Calendar: Calendar;
	Day: Day;
	calendarButton: HTMLButtonElement;
	months$: Subscription;
	today: number;

	constructor() {
		this.today = Date.now();
		this.Calendar = new Calendar();
		this.calendarButton = document.querySelector("[data-type=ShowCalendarButton]");
		this.months$ = fromEvent(this.calendarButton, "click")
			.pipe(map((_) => this.Calendar.getMonths("2020-01-01", "2020-12-31"))) // document.querySelector('#dateFrom').value,document.querySelector('#dateTo).value
			.subscribe((months) => {
				const calendar: HTMLDivElement = document.querySelector(".calendar") || this.Calendar.createCalendar();
				months.forEach((month, monthIndex) => {
					// create a DOM element with monthname and year
					// prevent ts error 'Object is possibly 'undefined'.ts(2532)'
					// // tslint:disable-next-line
					const _month = this.Calendar.createMonth(
						month[1][0].toLocaleDateString(),
						month[1][0].getFullYear()
					);
					// add a DOM element to the month
					this.Calendar.addWeekToMonth(this.Calendar.createDaysRow(), _month);
					// for each week in the month...
					month.forEach((week: Day[], weekIndex: number) => {
						// ...create a DOM element
						const _week = this.Calendar.createWeek();
						// ... for each day in the week
						week.forEach((day, dayIndex) => {
							//  add a DOM element to the parent DOM element
							this.Calendar.addDayToWeek(this.Calendar.createDay(day), _week);
						});
						// add the week DOM element to the month
						this.Calendar.addWeekToMonth(_week, _month);
					});
					// add the month DOM element to the calendar
					this.Calendar.addMonthToCalendar(_month, calendar);
				});
				// add the calendar DOM element to the container
				this.Calendar.addCalendarToContainer(calendar);
			});
	}
}

new Main();
