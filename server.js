import bodyParser from "body-parser";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import initialize, {
  getStudentsData,
  getCoursesData,
  getStudentsByCourse,
  getStudentByNum,
  getCourseById,
  addStudent,
  updateStudent,
} from "./modules/collegeData.js";

import exphbs from "express-handlebars";

var app = express();
var HTTP_PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.set("views", "./views");
app.engine(
  "hbs",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "main",
    helpers: {
      navLink: (url, options) => {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      log: function (value) {
        console.log(value);
      },
    },
  })
);
app.set("view engine", "hbs");

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
  getStudentsData()
    .then((value) => {
      res.render("students", { students: value });
    })
    .catch((err) => {
      res.render("students", { message: "no results" });
    });
});

app.get("/courses", (req, res) => {
  getCoursesData()
    .then((value) => {
      res.render("courses", { courses: value });
    })
    .catch((err) => {
      res.render("courses", { message: "no results" });
    });
});

app.get("/courses/:id", (req, res) => {
  getCourseById(req.params.id)
    .then((value) => {
      res.render("course", { course: value });
    })
    .catch((err) => {
      res.render("course", { message: "no results" });
    });
});

app.get("/student/:id", (req, res) => {
  getStudentByNum(req.params.id)
    .then((value) => {
      res.render("student", { student: value });
    })
    .catch((err) => {
      res.render("student", { message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
  updateStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});

app.get("/students/:course", (req, res) => {
  getStudentsByCourse(req.params.course)
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

app.get("/studentss/add", (req, res) => {
  res.render("addStudent");
});

app.post("/studentss/add", (req, res) => {
  addStudent(req.body)
    .then((value) => {
      res.send(value);
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/error.html"));
});

// setup http server to listen on HTTP_PORT
initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
