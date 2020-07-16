class Day {
	Date: Date;
	year: number;
	month: number;
	date: number;
	dateId: number;
	time: number;

	constructor(day?: Date) {
		this.Date = day;
		this.year = this.Date ? this.Date.getFullYear() : -1;
		this.month = this.Date ? this.Date.getMonth() : -1;
		this.date = this.Date ? this.Date.getDate() : -1;
		this.time = day ? day.getTime() : Math.ceil(Math.random() * 100000);
	}

	/** get the date
	 *
	 */
	getDate(): number {
		return this.Date ? this.Date.getDate() : -1;
	}

	/**
	 * return the month index of the date
	 */
	getMonth(): number {
		return this.Date ? this.Date.getMonth() : -1;
	}
	/**
	 * return the index of the weekday
	 */
	getDay(): number {
		return this.Date.getDay();
	}

	/**
	 * get the date in milliseconds
	 */
	getTime(): number {
		return this.Date.getTime();
	}

	/**
	 * get the unique id of a date
	 */

	getDateId(): string {
		return this.time + "";
	}

	toLocaleDateString(): string {
		return this.Date.toLocaleDateString(navigator.language, { month: "long" });
	}

	getFullYear(): number {
		return this.Date.getFullYear();
	}
}

export { Day };
