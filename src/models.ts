export class alarm {
	dayId: number;
	alarmTime: number;
	alarmTitle: string;
	alarmDescription: string;
}

export class TDay {
	constructor(day: Date, dateId: string, today: number) {}
	date: number;
	dateId: number;
	getDate: () => string;
	getDateId: () => string;
	setDateId: () => string;
	getTime: () => number;
}
