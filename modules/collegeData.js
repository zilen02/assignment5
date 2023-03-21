import fs from "fs";

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    var courseDataFromFile, studentsDataFromFile;

    courseDataFromFile = fs.readFileSync("./data/courses.json", "utf8");
    courseDataFromFile = JSON.parse(courseDataFromFile);

    studentsDataFromFile = fs.readFileSync("./data/students.json", "utf8");
    studentsDataFromFile = JSON.parse(studentsDataFromFile);

    dataCollection = new Data(studentsDataFromFile, courseDataFromFile);
    if (dataCollection) {
      resolve(dataCollection);
    } else {
      reject("Unable to read!");
    }
  });
}

export function getStudentsData() {
  return new Promise((resolve, reject) => {
    var studentsDataFromFile = dataCollection.students;

    if (studentsDataFromFile.length != 0) {
      resolve(studentsDataFromFile);
    } else {
      reject("no results returned");
    }
  });
}

export function getCoursesData() {
  return new Promise((resolve, reject) => {
    var courseDataFromFile = dataCollection.courses;

    if (courseDataFromFile.length != 0) {
      resolve(courseDataFromFile);
    } else {
      reject("no results returned");
    }
  });
}

export function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    var studentsDataFromFile = dataCollection.students;
    var studentsWithGivenCourse = studentsDataFromFile.filter(
      (student) => student.course == course
    );

    if (studentsWithGivenCourse.length != 0) {
      resolve(studentsWithGivenCourse);
    } else {
      reject("no results returned");
    }
  });
}

export function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    var studentsDataFromFile = dataCollection.students;
    var studentsWithGivenNum = studentsDataFromFile.filter(
      (student) => student.studentNum == num
    );

    if (studentsWithGivenNum.length != 0) {
      resolve(studentsWithGivenNum[0]);
    } else {
      reject("no results returned");
    }
  });
}

export function getCourseById(id) {
  return new Promise((resolve, reject) => {
    var coursesDataFromFile = dataCollection.courses;
    var coursesWithGivenNum = coursesDataFromFile.filter(
      (course) => course.courseId == id
    );

    if (coursesWithGivenNum.length != 0) {
      resolve(coursesWithGivenNum[0]);
    } else {
      reject("query returned 0 results");
    }
  });
}

export function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    var studentsDataFromFile = dataCollection.students;
    let newStudent;
    if (studentData.TA) {
      newStudent = {
        ...studentData,
        TA: true,
        studentNum: studentsDataFromFile.length + 1,
      };
    } else {
      newStudent = {
        ...studentData,
        TA: false,
        studentNum: studentsDataFromFile.length + 1,
      };
    }
    dataCollection.students.push(newStudent);

    if (studentsDataFromFile.length != 0) {
      resolve(newStudent);
    } else {
      reject("no results returned");
    }
  });
}

export function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    var studentsDataFromFile = dataCollection.students;
    var newStudentsData = studentsDataFromFile.map((sdata) => {
      if (sdata.studentNum == studentData.studentNum) {
        return studentData;
      } else {
        return sdata;
      }
    });
    dataCollection.students = newStudentsData;
    resolve();
  });
}

export default initialize;
