import "./index.css";
import "./components/modal.css";
import "./components/date.css";
import { Calendar } from "./calendar";
import * as data from "./data.json"

const container = document.getElementById("calendar");
const monthNavigation = document.getElementById("monthNav");
const modal = document.getElementById("myModal");

const calendar = new Calendar(monthNavigation);
console.log(calendar);

// monthNameContainer.appendChild(MonthName("", 100));

// for (const month of calendar.getMonths()) {
//     const monthName = MonthName(month.name, (month.spaces) * 100 + (month.spaces) * 3);
//     monthNameContainer.appendChild(monthName);
// }

calendar.addRules(data.rules);
calendar.draw(container);
// calendar.clearCalendar();

// calendar.addDays();
// calendar.addRules(data.rules);
// calendar.draw(container);

// document.addEventListener("DOMContentLoaded", function(event) {
//     setTimeout(() => {
//         const currentDate = document.getElementsByClassName("current-date")[0];
//         currentDate.scrollIntoView({ behavior: 'smooth' })
//     }, 1000);
// });

window.onclick = (event: Event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

document.getElementById("negi").onclick = (e: MouseEvent) => {
    if (e.target instanceof HTMLInputElement) {
        if (e.target.checked) {
            console.log("checked");
        } else {
            console.log("unchecked");
        }
    }
};

// This is how the calendar interface should look like
// const calendar = new Calendar();
// calendar.addRules(data.rules);
// calendar.draw();
// calendar.clearRules();