import type { ApiResponse, JsonEvent } from "./types";

class EventsPage {
    // managed state
    private eventsData: JsonEvent[];
    private containerElement: HTMLDivElement;

    // referenced dom elements
    private nameInput: HTMLInputElement;
    private pointsInput: HTMLInputElement;
    private inputMessage: HTMLParagraphElement;

    createPage() {
        const newElement = document.createElement("div");
        newElement.classList.add("page-container");
        newElement.append(this.createTable());

        this.containerElement.replaceWith(newElement);
        this.containerElement = newElement;
    }

    // helpers
    private createTable() {
        // header row
        const hc1 = document.createElement("th");
        const hc2 = document.createElement("th");

        hc1.innerText = "Name";
        hc1.classList.add("event-name");
        hc2.innerText = "Points";
        hc2.classList.add("points");

        const headRow = document.createElement("tr");
        headRow.append(hc1, hc2);

        // table
        const table = document.createElement("table");
        table.append(headRow);

        // event rows
        for (const event of this.eventsData) {
            const c1 = document.createElement("td");
            const c2 = document.createElement("td");

            c1.innerText = event.name;
            c1.classList.add("event-name");
            c2.innerText = String(event.points);
            c2.classList.add("points");

            const row = document.createElement("tr");
            row.append(c1, c2);

            table.append(row);
        }

        // blank row
        const blankc1 = document.createElement("td");
        const blankc2 = document.createElement("td");

        // const nameIn = document.createElement("input");
        // nameIn.type = "text";
        // nameIn.id = "name-input";

        // const pointsIn = document.createElement("input");
        // pointsIn.type = "text";
        // pointsIn.id = "points-input";

        blankc1.append(this.nameInput);
        blankc2.append(this.pointsInput);
        blankc2.classList.add("points-col");

        const blankRow = document.createElement("tr");
        blankRow.classList.add("blank-row");
        blankRow.append(blankc1, blankc2);

        table.append(blankRow);

        // add event row
        const link = document.createElement("a");
        link.innerText = "+ add event";
        link.addEventListener("click", (_event) => {
            this.addEvent();
        });

        // const inputMessage = document.createElement("span");
        // inputMessage.id = "input-message"

        const addc1 = document.createElement("td");
        addc1.colSpan = 2;
        addc1.append(link, this.inputMessage);

        const addRow = document.createElement("tr");
        addRow.classList.add("add-row");
        addRow.append(addc1);

        table.append(addRow);

        return table;
    }

    // updaters
    private async addEvent() {
        const name = encodeURI(this.nameInput.value);
        const points = encodeURI(this.pointsInput.value);

        const res: ApiResponse<null> = await (
            await fetch(`/api/events.json?name=${name}&points=${points}`, {
                method: "POST",
            })
        ).json();

        if (!res.success) {
            this.inputMessage.innerText = res.message;
            return;
        }

        this.nameInput.value = "";
        this.pointsInput.value = "";

        await this.refreshData();
        this.createPage();
    }

    // helpers
    private async refreshData() {
        let eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch("/api/events.json")
        ).json();
        this.eventsData = eventsRes.data;
    }

    // constructors
    static async new() {
        let eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch("/api/events.json")
        ).json();
        const container: HTMLDivElement | null =
            document.querySelector("div.page-container");

        if (!container) {
            return undefined;
        }

        const page = new this(eventsRes.data, container);
        page.createPage();

        return page;
    }

    constructor(eventsData: JsonEvent[], container: HTMLDivElement) {
        this.eventsData = eventsData;
        this.containerElement = container;

        this.nameInput = document.createElement("input");
        this.pointsInput = document.createElement("input");
        this.inputMessage = document.createElement("p");

        this.nameInput.type = "text";
        this.pointsInput.type = "text";
    }
}

//
// on start
//

async function run() {
    const page = await EventsPage.new();

    if (!page) {
        return; // serious error has occured
    }
}

run();
