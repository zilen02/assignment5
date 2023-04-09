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
  addCourse,
  updateCourse,
  deleteStudentByNum,
  deleteCourseById,
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
      if (value.length) {
        res.render("students", { students: value });
      } else {
        res.render("students", { message: "no results" });
      }
    })
    .catch((err) => {
      res.render("students", { message: "no results" });
    });
});

app.get("/courses", (req, res) => {
  getCoursesData()
    .then((value) => {
      if (value.length) {
        res.render("courses", { courses: value });
      } else {
        res.render("courses", { message: "no results" });
      }
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
      res.sendFile(path.join(__dirname + "/views/error.html"));
    });
});

app.get("/student/:id", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  getStudentByNum(req.params.id)
    .then((data) => {
      if (data) {
        viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // set student to null if there was an error
    });

  getCoursesData()
    .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
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

app.post("/course/update", (req, res) => {
  updateCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});

app.get("/course/delete/:id", (req, res) => {
  deleteCourseById(req.params.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.send({ message: "Unable to Remove Course" });
    });
});

app.get("/student/delete/:id", (req, res) => {
  deleteStudentByNum(req.params.id)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send({ message: "Unable to Remove Student" });
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
  getCoursesData()
    .then((value) => {
      if (value.length) {
        res.render("addStudent", { courses: value });
      } else {
        res.render("addStudent", { courses: [] });
      }
    })
    .catch((err) => {
      res.render("addStudent", { courses: [] });
    });
});

app.post("/studentss/add", (req, res) => {
  addStudent(req.body)
    .then((value) => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});

app.get("/coursess/add", (req, res) => {
  res.render("addCourse");
});

app.post("/coursess/add", (req, res) => {
  addCourse(req.body)
    .then((value) => {
      res.redirect("/courses");
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
