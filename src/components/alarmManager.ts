import { alarm } from "../models";

class AlarmManager {
	activeAlarms: object[];
	dayId: string;
	today: number;
	date: number;
	alarmClasses: { [key: string]: string } = {
		low: "alarmLevelLow",
		moderate: "alarmLevelModerate",
		high: "alarmLevelHigh",
	};

	constructor() {
		this.activeAlarms = [];
		const w = document.querySelector(".alarmWindow");
		w.querySelector(".close").addEventListener("click", this.closeAlarmWindow);
		w.querySelector(".cancel").addEventListener("click", this.closeAlarmWindow);
		w.querySelector(".save").addEventListener("click", this.addAlarm);
		setInterval(
			() =>
				this.activeAlarms.forEach((alarm: alarm, i: number, activeAlarms: alarm[]) =>
					this.checkAlarm(alarm, Date.now(), activeAlarms)
				),
			1000
		);
	}

	getClassByLevel = (level: string): string => this.alarmClasses[level];

	closeAlarmWindow() {
		(<HTMLInputElement>document.querySelector("input[type=datetime-local]")).value = null;
		(<HTMLTextAreaElement>document.querySelector(".alarmTitle input")).value = null;
		(<HTMLTextAreaElement>document.querySelector("textarea.alarmDescription")).value = null;
		//@ts-ignore
		document.querySelectorAll("input[type=radio][name=alarmLevel]").forEach((alarm) => (alarm.checked = false));
		document.querySelector(".alarmWindow").classList.toggle("d-none");
	}

	addClassForDay(selector: string, klass: string): void {
		document.querySelector(selector).classList.add(klass);
	}

	getClassForAlarmLevel(level: string): string {
		return this.getClassByLevel(level);
	}

	showAlarmWindow(dayId: string, date: number) {
		this.dayId = dayId;
		this.date = date;
		document.querySelector(".alarmWindow").classList.remove("d-none");
	}

	addAlarm = () => {
		const alarmWindow = document.querySelector(".alarmWindow");
		let alarmSeverity: string;
		alarmWindow.querySelectorAll("input[type=radio][name=alarmLevel]").forEach(
			(alarm) =>
				// Ts does not know HTMLRadioButton and disallows .checked on a HTMLElement value.
				// @ts-ignore
				(alarmSeverity = alarm.checked ? alarm.value : alarmSeverity)
		);
		const alarm = {
			dayId: this.dayId,
			alarmTime: new Date((<HTMLInputElement>alarmWindow.querySelector(".alarmTime input")).value).getTime(),
			alarmTitle: (<HTMLInputElement>alarmWindow.querySelector(".alarmTitle input")).value,
			alarmDescription: (<HTMLTextAreaElement>alarmWindow.querySelector(".alarmDescription")).value,
			alarmSeverity: alarmSeverity,
		};
		this.activeAlarms.push(alarm);
		this.closeAlarmWindow();
		this.addClassForDay(`span[data-day-id='${this.dayId}']`, this.getClassForAlarmLevel(alarmSeverity));
	};

	// check the active alarms
	checkAlarm = (alarm: alarm, now: number, activeAlarms: alarm[]) => {
		if (alarm.alarmTime <= now) {
			console.log(
				`ALARM! Vergeet niet ${alarm.alarmTitle}: ${alarm.alarmDescription} (het is immers ${new Date(
					alarm.alarmTime
				)})`
			);
			activeAlarms.splice(
				activeAlarms.findIndex((alarm) => alarm.alarmTime <= now),
				1
			);
		}
	};
}

export { AlarmManager };
