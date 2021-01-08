export function createDateElement(date: number, className: string, isToday: boolean): HTMLDivElement {
    let dateDiv = document.createElement("div");
    dateDiv.innerHTML = date === 0 ? '' : String(date);
    dateDiv.className = className;
    if (isToday) {
        console.log("here");
        dateDiv.className += " current-date";
    }
    return dateDiv;
}

export function createMonthNameElement(name: string, weeks: number): HTMLDivElement {
    let div = document.createElement("div");
    div.innerHTML = name;
    div.className = `month-name-${weeks}`;
    return div;
}

function addIntervalRule(from: string, to: string) {
    
}