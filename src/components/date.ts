import "./date.css"

interface day {
    dayTotal: number,
    date: number,
    dayOfWeek: number,
    isToday: boolean
}

interface week {
    weekOfMonth: number,
    days: day[]
}

interface month {
    name: string,
    month: number,
    weeks: week[]
}

class DateElement {
    element: HTMLDivElement;
    day: day;
    month: month;
    entries: any[] = [];

    constructor(date: number, additionalClasses: string[], day: day, month: month) {
        this.element = document.createElement("div");
        this.element.classList.add("item");
        this.element.innerHTML = date === 0 ? '' : String(date);
        additionalClasses.forEach(c => this.element.classList.add(c));
        if (day.isToday) {
            this.element.className += " current-date";
        }
        this.day = day
        this.month = month
        const modal = document.getElementById("myModal");
        this.element.onclick = () => {
            let modalContent = document.querySelector(".modal-content");
            if (this.entries.length) {
                modalContent.innerHTML = this.entries.map(e => e.rule.text).join("</br></br>");
            } else {
                modalContent.innerHTML = "Šajā dienā nav nekādu noteikumu";
            }
            modal.style.display = "block";
        };
    }

    addEntry(rule: any, ruleColor: string) {
        let entryDiv = document.createElement("div");
        entryDiv.classList.add("date-entry");
        entryDiv.style.backgroundColor = ruleColor;

        this.element.appendChild(entryDiv);
        this.entries.push({
            element: entryDiv,
            rule,
            color: ruleColor
        });
    }
}


export default DateElement;