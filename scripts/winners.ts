import type { JsonStudent, JsonEvent, ApiResponse } from "./types";

class WinnersPage {
    private studentsData: JsonStudent[];
    private eventsData: JsonEvent[];
    private containerElement: HTMLDivElement;

    // create methods
    createPage() {
        const newElement = document.createElement("div");
        newElement.classList.add("page-container");
        newElement.append(
            this.createPointWinners(),
            this.createRandomWinners()
        );

        this.containerElement.replaceWith(newElement);
        this.containerElement = newElement;
    }

    // create helper methods
    private createPointWinners() {
        // calculated info
        let student9 = this.getPointWinner(9);
        let student10 = this.getPointWinner(10);
        let student11 = this.getPointWinner(11);
        let student12 = this.getPointWinner(12);

        // inner info
        const grade9Winner = document.createElement("p");
        const grade10Winner = document.createElement("p");
        const grade11Winner = document.createElement("p");
        const grade12Winner = document.createElement("p");

        grade9Winner.innerText =
            " Grade 9: " +
            student9.first_name +
            " " +
            student9.last_name +
            " (" +
            this.calcPoints(student9) +
            "pts)";
        grade10Winner.innerText =
            "Grade 10: " +
            student10.first_name +
            " " +
            student10.last_name +
            " (" +
            this.calcPoints(student10) +
            "pts)";
        grade11Winner.innerText =
            "Grade 11: " +
            student11.first_name +
            " " +
            student11.last_name +
            " (" +
            this.calcPoints(student11) +
            "pts)";
        grade12Winner.innerText =
            "Grade 12: " +
            student12.first_name +
            " " +
            student12.last_name +
            " (" +
            this.calcPoints(student12) +
            "pts)";

        // div
        const header = document.createElement("h2");
        header.innerText = "Point Leaders";

        const div = document.createElement("div");
        div.classList.add("point-winners");
        div.append(
            header,
            grade9Winner,
            grade10Winner,
            grade11Winner,
            grade12Winner
        );

        return div;
    }
    private createRandomWinners() {
        // calculated info
        let student9 = this.getRandomWinner(9);
        let student10 = this.getRandomWinner(10);
        let student11 = this.getRandomWinner(11);
        let student12 = this.getRandomWinner(12);

        // inner info
        const grade9Winner = document.createElement("p");
        const grade10Winner = document.createElement("p");
        const grade11Winner = document.createElement("p");
        const grade12Winner = document.createElement("p");

        grade9Winner.innerText =
            " Grade 9: " +
            student9.first_name +
            " " +
            student9.last_name +
            " (" +
            this.calcPoints(student9) +
            "pts)";
        grade10Winner.innerText =
            "Grade 10: " +
            student10.first_name +
            " " +
            student10.last_name +
            " (" +
            this.calcPoints(student10) +
            "pts)";
        grade11Winner.innerText =
            "Grade 11: " +
            student11.first_name +
            " " +
            student11.last_name +
            " (" +
            this.calcPoints(student11) +
            "pts)";
        grade12Winner.innerText =
            "Grade 12: " +
            student12.first_name +
            " " +
            student12.last_name +
            " (" +
            this.calcPoints(student12) +
            "pts)";

        // div
        const header = document.createElement("h2");
        header.innerText = "Random Winners";

        const div = document.createElement("div");
        div.classList.add("random-winners");
        div.append(
            header,
            grade9Winner,
            grade10Winner,
            grade11Winner,
            grade12Winner
        );

        return div;
    }

    // getters
    private getPointWinner(lvl: 9 | 10 | 11 | 12): JsonStudent {
        const grade = this.studentsData.filter((student) => {
            return student.grade_lvl === lvl;
        });

        if (!grade[0]) {
            return {
                id: 0,
                first_name: "No",
                last_name: "student",
                grade_lvl: 12,
                completed_events: [],
            };
        }

        let pointLead = grade[0];
        let mostPoints = this.calcPoints(grade[0]);
        for (const student of grade) {
            const newPoints = this.calcPoints(student);
            if (newPoints > mostPoints) {
                pointLead = student;
                mostPoints = newPoints;
            }
        }

        return pointLead;
    }
    private getRandomWinner(lvl: 9 | 10 | 11 | 12): JsonStudent {
        const pointLead = this.getPointWinner(lvl);
        const grade = this.studentsData.filter((student) => {
            let isLeader = student.id === pointLead.id;
            let isGrade = student.grade_lvl === lvl;
            return !isLeader && isGrade;
        });

        console.dir(pointLead);
        console.dir(grade);

        const selected = grade[Math.floor(Math.random() * grade.length)];
        return selected
            ? selected
            : {
                  id: 0,
                  first_name: "No",
                  last_name: "student",
                  grade_lvl: 12,
                  completed_events: [],
              };
    }

    private calcPoints(student: JsonStudent) {
        let points = 0;
        for (const eventId of student.completed_events) {
            let foundEvent = this.eventsData.find((eventObj) => {
                return eventObj.id === eventId;
            });

            if (!foundEvent) {
                continue;
            }

            points += foundEvent.points;
        }
        return points;
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
            return;
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
    }
}

//
// on start
//

async function run() {
    const page = await WinnersPage.new();

    if (!page) {
        return; // serious error has occured
    }
}

run();
