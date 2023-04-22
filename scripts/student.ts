import type { JsonStudent, JsonEvent, ApiResponse } from "./types";

// page representation
class StudentPage {
    // main state
    private studentData: JsonStudent;
    private eventsData: JsonEvent[];
    private containerElement: HTMLDivElement;

    // micro state
    private dropdownElement: HTMLSelectElement;

    // create element
    createPage() {
        const name = document.createElement("h1");
        name.classList.add("student-name");
        name.innerText =
            this.studentData.first_name + " " + this.studentData.last_name;

        const info = this.createInfoDiv();
        const table = this.createTable();
        const addEvent = this.createAddEvent();

        const newElement = document.createElement("div");
        newElement.classList.add("page-container");
        newElement.append(name, info, table, addEvent);

        this.containerElement.replaceWith(newElement);
        this.containerElement = newElement;
    }

    // element creators
    private createTable() {
        // header row
        const hc1 = document.createElement("th");
        const hc2 = document.createElement("th");

        hc1.innerText = "Event";
        hc2.innerText = "Points";

        const headerRow = document.createElement("tr");
        headerRow.append(hc1, hc2);

        // table
        const table = document.createElement("table");
        table.append(headerRow);

        // event rows
        for (const event of this.getCompletedEventsData()) {
            const c1 = document.createElement("td");
            const c2 = document.createElement("td");

            c1.innerText = event.name;
            c2.innerText = String(event.points);

            const row = document.createElement("tr");
            row.append(c1, c2);

            table.append(row);
        }

        return table;
    }
    private createInfoDiv() {
        const firstName = document.createElement("p");
        const lastName = document.createElement("p");
        const gradeLvl = document.createElement("p");
        const points = document.createElement("p");

        firstName.innerText = "First Name: " + this.studentData.first_name;
        lastName.innerText = "Last Name: " + this.studentData.last_name;
        gradeLvl.innerText = "Grade: " + this.studentData.grade_lvl;
        points.innerText = "Points: " + this.getPoints();

        const info = document.createElement("div");
        info.classList.add("info");
        info.append(firstName, lastName, gradeLvl, points);

        return info;
    }
    private createAddEvent() {
        // button
        const button = document.createElement("p");
        button.innerText = "Submit";
        button.addEventListener("click", (_event) => {
            this.addEvent();
        });

        // container
        const addEvent = document.createElement("div");
        addEvent.classList.add("add-event");
        addEvent.append(this.dropdownElement, button);

        return addEvent;
    }

    // getter functions
    private getPoints() {
        let points = 0;
        for (const event of this.getCompletedEventsData()) {
            points += event.points;
        }
        return points;
    }
    private getCompletedEventsData() {
        let completedEvents = [];
        for (const eventId of this.studentData.completed_events) {
            const event = this.eventsData.find((eventObj) => {
                return eventObj.id === eventId;
            });

            if (!event) {
                continue;
            }

            completedEvents.push(event);
        }
        return completedEvents;
    }
    private getIncompleteEventsData() {
        let incomleteEvents = [];
        for (const event of this.eventsData) {
            const found = this.studentData.completed_events.indexOf(event.id);
            if (found !== -1) {
                continue;
            }

            incomleteEvents.push(event);
        }
        return incomleteEvents;
    }

    // on event functions
    private async addEvent() {
        let eventId = encodeURI(this.dropdownElement.value);

        await (
            await fetch(
                `/api/students/${this.studentData.id}/completed_events.json?event_id=${eventId}`,
                { method: "POST" }
            )
        ).json();

        await this.refreshData();
        this.createPage();
    }

    // data getters
    private async refreshData() {
        const studentRes: ApiResponse<JsonStudent | null> = await (
            await fetch(`/api/students/${this.studentData.id}.json`)
        ).json();
        const eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch(`/api/events.json`)
        ).json();

        if (!studentRes.data) {
            return undefined;
        }

        this.studentData = studentRes.data;
        this.eventsData = eventsRes.data;

        this.dropdownElement = document.createElement("select");
        for (const event of this.getIncompleteEventsData()) {
            const option = document.createElement("option");
            option.value = String(event.id);
            option.innerText = event.name;
            this.dropdownElement.append(option);
        }

        return undefined;
    }

    // constructors
    static async new(id: number) {
        const studentRes: ApiResponse<JsonStudent | null> = await (
            await fetch(`/api/students/${id}.json`)
        ).json();
        const eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch(`/api/events.json`)
        ).json();
        const container: HTMLDivElement | null =
            document.querySelector("div.page-container");

        if (!studentRes.data || !container) {
            return undefined;
        }

        const page = new this(studentRes.data, eventsRes.data, container);
        page.createPage();

        return page;
    }

    constructor(
        studentData: JsonStudent,
        eventsData: JsonEvent[],
        container: HTMLDivElement
    ) {
        this.studentData = studentData;
        this.eventsData = eventsData;
        this.containerElement = container;

        this.dropdownElement = document.createElement("select");
        for (const event of this.getIncompleteEventsData()) {
            const option = document.createElement("option");
            option.value = String(event.id);
            option.innerText = event.name;
            this.dropdownElement.append(option);
        }
    }
}

//
// on start
//

async function run() {
    const page = await StudentPage.new(Number(document.title));

    if (!page) {
        return; // serious error has occured
    }
}

run();
