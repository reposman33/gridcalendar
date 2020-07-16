class Day {
	date: Date;
	dateId: number;

	constructor(day?: Date) {
		this.date = day;
	}

	/** get the date
	 *
	 */
	getDate(): number {
		return this.date ? this.date.getDate() : -1;
	}

	/**
	 * return the month index of the date
	 */
	getMonth(): number {
		return this.date ? this.date.getMonth() : -1;
	}
	/**
	 * return the index of the weekday
	 */
	getDay(): number {
		return this.date.getDay();
	}

	/**
	 * get the date in milliseconds
	 */
	getTime(): number {
		return this.date.getTime();
	}

	/**
	 * get the unique id of a date
	 */

	getDateId(): string {
		return this.dateId + "";
	}

	setDateId(id: number): void {
		this.dateId = id;
	}

	toLocaleDateString(): string {
		return this.date.toLocaleDateString(navigator.language, { month: "long" });
	}

	getFullYear(): number {
		return this.date.getFullYear();
	}
}

export { Day };
