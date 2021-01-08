export function MonthName(monthName: string, height: number) {
    let element = document.createElement("div");
    element.innerHTML = `<div class="vertical-text">${monthName}</div>`;
    element.style.height = `${height}px`;
    element.classList.add("month-name");

    return element;
}