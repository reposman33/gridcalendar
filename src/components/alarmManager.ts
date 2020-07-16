import { alarm } from "../models";

class AlarmManager {
	activeAlarms: object[];
	dayId: number;
	today: number;

	constructor() {
		this.activeAlarms = [];
		setInterval(
			() =>
				this.activeAlarms.forEach((alarm: alarm, i: number, activeAlarms: alarm[]) =>
					this.checkAlarm(alarm, Date.now(), activeAlarms)
				),
			1000
		);
	}

	closeAlarmWindow() {
		document.querySelector(".alarmWindow").classList.toggle("d-none");
	}

	showAlarmWindow(dayId: string, date: number | string) {
		const w = document.querySelector(".alarmWindow");
		w.querySelector(".close").addEventListener("click", this.closeAlarmWindow);
		w.querySelector(".cancel").addEventListener("click", this.closeAlarmWindow);
		w.classList.remove("d-none");
		w.querySelector("button.save").addEventListener("click", () => this.addAlarm(dayId, date));
	}

	addAlarm(dayId: string, date: number | string) {
		const alarm = {
			dayId: dayId,
			alarmTime: new Date((<HTMLInputElement>document.querySelector(".alarmTime input")).value).getTime(),
			alarmTitle: (<HTMLInputElement>document.querySelector(".alarmTitle input")).value,
			alarmDescription: (<HTMLTextAreaElement>document.querySelector(".alarmDescription")).value,
		};
		this.activeAlarms.push(alarm);
		this.closeAlarmWindow();
		console.log("activeAlarms: ", this.activeAlarms);
	}

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
