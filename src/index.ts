import "rxjs";
import { fromEvent, Subscription } from "rxjs";
import { map, subscribeOn } from "rxjs/operators";
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
	yearSelect: Subscription;
	selectedYear: string;
	today: number;

	constructor() {
		this.today = Date.now();
		this.Calendar = new Calendar();
		this.yearSelect = fromEvent(document.querySelector("#years"), "change").subscribe((selectedYear) => {
			const inputEl = selectedYear.target as HTMLInputElement;
			this.selectedYear = inputEl.value;
			//console.log("inputEl = ", inputEl);
		});
		this.calendarButton = <HTMLButtonElement>document.querySelector("[data-type=ShowCalendarButton]");
		this.months$ = fromEvent(this.calendarButton, "click")
			.pipe(map((_) => this.Calendar.getMonths(Number(this.selectedYear))))
			.subscribe((months) => {
				const calendar: HTMLDivElement = this.Calendar.createCalendar();
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
