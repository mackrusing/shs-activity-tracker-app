import type { ApiResponse, JsonStudent, JsonEvent } from "./types";

class StudentsPage {
    // overall managed state
    private studentsData: JsonStudent[];
    private eventsData: JsonEvent[];
    private containerElement: HTMLDivElement;

    // minor managed elements
    private gradeLvlInput: HTMLInputElement;
    private firstNameInput: HTMLInputElement;
    private lastNameInput: HTMLInputElement;

    private inputMessage: HTMLParagraphElement;

    // change dom
    createPage() {
        const newElement = document.createElement("div");
        newElement.classList.add("page-container");
        newElement.append(this.createTable());

        this.containerElement.replaceWith(newElement);
        this.containerElement = newElement;
    }

    // create element
    private createTable() {
        // header row
        const hc1 = document.createElement("th");
        const hc2 = document.createElement("th");
        const hc3 = document.createElement("th");
        const hc4 = document.createElement("th");

        hc1.innerText = "Grade";
        hc2.innerText = "First Name";
        hc3.innerText = "Last Name";
        hc4.innerText = "Points";
        hc4.classList.add("points");

        const headRow = document.createElement("tr");
        headRow.append(hc1, hc2, hc3, hc4);

        // table
        const table = document.createElement("table");
        table.append(headRow);

        // student rows
        for (const student of this.studentsData) {
            const c1 = document.createElement("td");
            const c2 = document.createElement("td");
            const c3 = document.createElement("td");
            const c4 = document.createElement("td");

            const link2 = document.createElement("a");
            const link3 = document.createElement("a");

            link2.href = `/students/${student.id}`;
            link3.href = `/students/${student.id}`;

            link2.innerText = student.first_name;
            link3.innerText = student.last_name;

            c1.innerText = String(student.grade_lvl);
            c2.append(link2);
            c3.append(link3);

            let points = 0;
            student.completed_events.forEach((eventId) => {
                const event = this.eventsData.find((e) => e.id === eventId);
                if (!event) {
                    return;
                }
                points += event.points;
            });
            c4.innerText = String(points);
            c4.classList.add("points");

            const row = document.createElement("tr");
            row.append(c1, c2, c3, c4);

            table.append(row);
        }

        // blank row
        const blankc1 = document.createElement("td");
        const blankc2 = document.createElement("td");
        const blankc3 = document.createElement("td");
        const blankc4 = document.createElement("td");

        blankc1.append(this.gradeLvlInput);
        blankc1.classList.add("grade-col");
        blankc2.append(this.firstNameInput);
        blankc3.append(this.lastNameInput);
        blankc4.classList.add("points");

        const blankRow = document.createElement("tr");
        blankRow.classList.add("blank-row");
        blankRow.append(blankc1, blankc2, blankc3, blankc4);

        table.append(blankRow);

        // add student row
        const link = document.createElement("a");
        link.innerText = "+ add student";
        link.addEventListener("click", (_event) => {
            this.addStudent();
        });

        const addc1 = document.createElement("td");
        addc1.colSpan = 4;
        addc1.append(link, this.inputMessage);

        const addRow = document.createElement("tr");
        addRow.classList.add("add-row");
        addRow.append(addc1);

        table.append(addRow);

        // return
        return table;
    }

    // updaters
    private async addStudent() {
        const gradeLvl = encodeURI(this.gradeLvlInput.value);
        const firstName = encodeURI(this.firstNameInput.value);
        const lastName = encodeURI(this.lastNameInput.value);

        const res: ApiResponse<null> = await (
            await fetch(
                `/api/students.json?grade_lvl=${gradeLvl}&first_name=${firstName}&last_name=${lastName}`,
                { method: "POST" }
            )
        ).json();

        if (!res.success) {
            this.inputMessage.innerText = res.message;
            return;
        }

        this.gradeLvlInput.value = "";
        this.firstNameInput.value = "";
        this.lastNameInput.value = "";

        await this.refreshData();
        this.createPage();
    }

    // helpers
    private async refreshData() {
        let studentsRes: ApiResponse<JsonStudent[]> = await (
            await fetch("/api/students.json")
        ).json();
        let eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch("/api/events.json")
        ).json();

        this.studentsData = studentsRes.data;
        this.eventsData = eventsRes.data;
    }

    // constructors
    static async new() {
        const studentsRes: ApiResponse<JsonStudent[]> = await (
            await fetch("/api/students.json")
        ).json();
        const eventsRes: ApiResponse<JsonEvent[]> = await (
            await fetch("/api/events.json")
        ).json();
        const container: HTMLDivElement | null =
            document.querySelector("div.page-container");

        if (!container) {
            return undefined;
        }

        const page = new this(studentsRes.data, eventsRes.data, container);
        page.createPage();

        return page;
    }

    constructor(
        studentsData: JsonStudent[],
        eventsData: JsonEvent[],
        containerElement: HTMLDivElement
    ) {
        this.studentsData = studentsData;
        this.eventsData = eventsData;
        this.containerElement = containerElement;

        this.gradeLvlInput = document.createElement("input");
        this.firstNameInput = document.createElement("input");
        this.lastNameInput = document.createElement("input");
        this.inputMessage = document.createElement("p");

        this.gradeLvlInput.type = "text";
        this.firstNameInput.type = "text";
        this.lastNameInput.type = "text";
    }
}

//
// on start
//

async function run() {
    const page = await StudentsPage.new();

    if (!page) {
        return; // serious error has occured
    }
}

run();
