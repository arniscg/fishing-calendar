import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear'
import * as isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import * as isBetween from 'dayjs/plugin/isBetween';
import{ MonthName } from "./components/MonthName";
import {getColor} from "./colors";
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);

export class Calendar {
    days: day[] = [];
    curYear: number = dayjs().year();
    curDay: number = dayjs().date();
    curMonth: number = dayjs().month() + 1;
    rules: rule[] = [];
    monthSpaces: number[] = [];
    container: HTMLElement;
    navigationContainer: HTMLElement
    monthContainer: HTMLDivElement;
    infoContainer: HTMLDivElement;
    dateContainer: HTMLDivElement;

    constructor(navigationContainer: HTMLElement) {
        this.navigationContainer = navigationContainer;
        this.addDays();
    }

    clearCalendar() {
        for (const el of [this.monthContainer, this.dateContainer, this.infoContainer]) {
            this.container.removeChild(el);
        }
        this.rules = [];
        this.days = [];
        this.monthContainer = undefined;
        this.dateContainer = undefined;
        this.infoContainer = undefined;
    }

    draw(container: HTMLElement): void {
        this.container = container;
        this.dateContainer = document.createElement("div");
        this.dateContainer.id = "dateContainer";
        this.monthContainer = document.createElement("div");
        this.monthContainer.id = "monthContainer";
        this.infoContainer = document.createElement("div");
        this.infoContainer.id = "infoContainer";
        const modal = document.getElementById("myModal");

        for (const day of this.days) {
            for (const entry of day.entries) {
                day.element.appendChild(entry.element);
            }

            day.element.onclick = () => {
                modal.querySelector(".modal-content").innerHTML = day.entries.filter(e => e.rule).map(e => e.rule.text).join("</br></br>");
                modal.style.display = "block";
            };

            this.dateContainer.appendChild(day.element);
        }

        for (const el of [this.monthContainer, this.dateContainer, this.infoContainer]) {
            container.appendChild(el);
        }

        this.addMonthNames();
    }

    addMonthNames(): void {
        this.monthContainer.appendChild(MonthName("", 100));

        for (const month of this.getMonths()) {
            const monthName = MonthName(month.name, (month.spaces) * 100 + (month.spaces) * 3);
            this.monthContainer.appendChild(monthName);
            const monthLink = document.createElement("a");
            monthLink.href = "#";
            monthLink.innerHTML = month.name;
            monthLink.onclick = () => {
                const el = this.days.find(d => d.month.name === month.name && d.date == 15).element;
                setTimeout(() => {
                    el.scrollIntoView({ block: "center", inline: "center" });
                }, 0);
            };
            this.navigationContainer.appendChild(monthLink);
        }
    }

    getMonths(): any[] {
        return this.days.filter(d => d.date === 1).map((d, i) => {
            return {
                name: d.month.name,
                spaces: this.monthSpaces[i]
            }
        })
    }

    addRules(rules: rule[]) {
        for (const rule of rules) {
            const ruleColor = getColor();
            console.log(ruleColor);
            
            const ruleDays = this.days.filter(d => this.isDayBetween(d, rule.from, rule.to));

            let ruleSlot = 0;
            while(true) {
                const res = ruleDays.find(d => ruleSlot in d.slots);
                if (res) {
                    ruleSlot++;
                } else {
                    break;
                }
            }

            ruleDays.forEach((day, idx) => {
                for (let i = 0; i < ruleSlot; i++) {
                    if (!day.slots.includes(i)) {
                        let entryDiv = document.createElement("div");
                        entryDiv.classList.add("date-entry");
                        day.entries.push({
                            element: entryDiv
                        });
                        day.slots.push(i);
                    }
                }

                let entryDiv = document.createElement("div");
                entryDiv.classList.add("date-entry");
                if (idx === 0) {
                    entryDiv.classList.add("entry-start");
                } else if (idx === ruleDays.length - 1) {
                    entryDiv.classList.add("entry-end");
                }
                entryDiv.style.backgroundColor = ruleColor;

                day.entries.push({
                    element: entryDiv,
                    rule,
                    color: ruleColor
                });

                day.slots.push(ruleSlot);
            });
        }
    }

    addDays() {
        let dayTotal = 0;
        let dayOfWeek = getFirstDayOfWeek();

        for (let i=0; i < dayOfWeek-1; i++) {
            this.days.push({
                dayTotal: -1,
                date: 0,
                dayOfWeek,
                isToday: false,
                element:  createDateElement(0, "blue-date"),
                month: {
                    name: '',
                    month: 0,
                    weekCount: 1
                },
                weekOfMonth: 0,
                ruleCount: 0,
                entries: [],
                slots: []
            });
        }

        let colorClass = "blue-date"
        for (let m=1; m <= 12; m++) {
            colorClass = colorClass === 'red-date' ? 'blue-date' : 'red-date';
            let spaces = 0;
            const monthString = `${this.curYear}-${m}`;
            const daysInMonth = dayjs(monthString).daysInMonth();
            let weekCount = dayOfWeek > 7 ? Math.ceil((daysInMonth) / 7) : Math.ceil((daysInMonth + dayOfWeek - 1) / 7);
            let weekOfMonth = 0;

            for (let d=1; d <= daysInMonth; d++) {
                if (dayOfWeek > 7) {
                    dayOfWeek = 1;
                    weekOfMonth++;
                    spaces++;
                } 

                let day: day = {
                    dayTotal,
                    date: d,
                    dayOfWeek,
                    isToday: (m === this.curMonth && d === this.curDay) ? true : false,
                    element: createDateElement(d, colorClass),
                    month: {
                        name: dayjs(String(m), 'M').format('MMMM'),
                        month: m,
                        weekCount
                    },
                    weekOfMonth,
                    ruleCount: 0,
                    entries: [],
                    slots: []
                }

                this.days.push(day);
                dayOfWeek++;
                dayTotal++;
            }
            this.monthSpaces.push(spaces);
        }
    }

    private isDayBetween(day: day, from: string, to: string): boolean {
        let date = dayjs(`${this.curYear}-${day.month.month}-${day.date}`);
    
        return date.isBetween(from, to, null, '[]');
    }
}

export interface day {
    month: month,
    weekOfMonth: number
    dayTotal: number,
    date: number,
    dayOfWeek: number,
    isToday: boolean,
    element: HTMLDivElement,
    ruleCount: number,
    entries: any[],
    slots: number[]
}

export interface month {
    name: string,
    month: number,
    weekCount: number
}

interface rule {
    text: string,
    from: string,
    to: string
}

export function getFirstDayOfWeek(): number {
    const thisYear = dayjs().year();
    let firstDay = dayjs(`${thisYear}-01-01`).day();

    if (firstDay === 0) {
        firstDay = 7;
    }

    return firstDay;
}

function createDateElement(date: number, colorClass: string): HTMLDivElement {
    let dateElement = document.createElement("div");
    dateElement.classList.add("item");
    dateElement.classList.add(colorClass);
    dateElement.innerHTML = date === 0 ? '' : String(date);

    return dateElement;
}