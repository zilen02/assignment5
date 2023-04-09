import fs from "fs";
import Sequelize from "sequelize";
var sequelize = new Sequelize(
  "pyazdqor",
  "pyazdqor",
  "2J6tRmnWQ5pq2BzbT2AuPfvWrd2plcmj",
  {
    host: "raja.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Student = sequelize.define("Student", {
  studentNum: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

var Course = sequelize.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: "course" });

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise(function (resolve, reject) {
    sequelize
      .authenticate()
      .then(function () {
        resolve("Connection has been established successfully.");
      })
      .catch(function (err) {
        reject("unable to sync the database:", err);
      });
  });
}

export function getStudentsData() {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then(function (data) {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}

export function getCoursesData() {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then(function (data) {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}

export function getStudentsByCourse(course) {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then(function (data) {
        var studentsDataFromFile = data;
        var studentsWithGivenCourse = studentsDataFromFile.filter(
          (student) => student.course == course
        );

        if (studentsWithGivenCourse.length != 0) {
          resolve(studentsWithGivenCourse);
        } else {
          reject("no results returned");
        }
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}

export function getStudentByNum(num) {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then(function (data) {
        var studentsDataFromFile = data;
        var studentsWithGivenNum = studentsDataFromFile.filter(
          (student) => student.studentNum == num
        );

        if (studentsWithGivenNum.length != 0) {
          resolve(studentsWithGivenNum[0]);
        } else {
          reject("no results returned");
        }
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}

export function getCourseById(id) {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then(function (data) {
        var coursesDataFromFile = data;
        var coursesWithGivenNum = coursesDataFromFile.filter(
          (course) => course.courseId == id
        );

        if (coursesWithGivenNum.length != 0) {
          resolve(coursesWithGivenNum[0]);
        } else {
          reject("query returned 0 results");
        }
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
}

export function addStudent(studentData) {
  return new Promise(function (resolve, reject) {
    Student.create(studentData)
      .then(function () {
        resolve("User created");
      })
      .catch((err) => {
        reject("unable to create student");
      });
  });
}

export function addCourse(courseData) {
  return new Promise(function (resolve, reject) {
    Course.create(courseData)
      .then(function () {
        resolve("Course created");
      })
      .catch((err) => {
        reject("unable to create course");
      });
  });
}

export function updateStudent(studentData) {
  return new Promise(function (resolve, reject) {
    // Student.update(studentData, {
    //   where: { studentNum: 2 },
    // })
    //   .then(function () {
    //     resolve("User updated");
    //   })
    //   .catch((err) => {
    //     reject("unable to update student");
    //   });
  });
}

export function updateCourse(courseData) {
  return new Promise(function (resolve, reject) {
    // Course.update(courseData)
    //   .then(function () {
    //     resolve("Course created");
    //   })
    //   .catch((err) => {
    //     reject("unable to update course");
    //   });
  });
}

export function deleteCourseById(courseData) {
  return new Promise(function (resolve, reject) {
    // Course.destory(courseData.courseId)
    //   .then(function () {
    //     resolve("Course deleted");
    //   })
    //   .catch((err) => {
    //     reject("unable to delete course");
    //   });
  });
}

export function deleteStudentByNum(studentNum) {
  return new Promise(function (resolve, reject) {
    return Student.destory({
      where: { firstName: "Emi" },
    })
      .then(function () {
        resolve("Student deleted");
      })
      .catch((err) => {
        reject("unable to delete student");
      });
  });
}

export default initialize;
