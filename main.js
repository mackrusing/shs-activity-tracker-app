import express from "express";

// app instance & variables
const app = express();
app.set("PORT", 8001); // process.env[PORT]
app.set("view engine", "pug");

// static routes
app.use("/resources/scripts", express.static("./build/scripts"));
app.use("/resources/styles", express.static("./build/styles"));

// dynamic routes
app.get("/students/:id", (req, res, next) => res.render("student", { id: Number(req.params["id"]) }));
app.get("/students", (_req, res) => res.render("students"));
app.get("/events", (_req, res) => res.render("events"));
app.get("/winners", (_req, res) => res.render("winners"));
app.all("*", (_req, res) => res.render("404"));

// make public
app.listen(app.get("PORT"), () => {
    console.log(`listening on ${app.get("PORT")}`);
});

