"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QUERIES = {
    tab: `
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      tel VARCHAR(15) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
    LecturerTable: `
    CREATE TABLE IF NOT EXISTS lecturers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    select: "SELECT id, firstname, lastname, tel, created_at FROM students",
    byid: "SELECT id, firstname, lastname, tel, created_at FROM students WHERE id = ?",
    insert: `
    INSERT INTO students (SET id, SET firstname, SET lastname, SET tel, SET password) 
    VALUES (?, ?, ?, ?, ?)
  `,
    update: `
    UPDATE students 
    SET firstname = ?, lastname = ?, tel = ?, password = ? 
    WHERE id = ?
  `,
    deleteStudent: "DELETE FROM students WHERE id = ?",
    StudentLogin: "SELECT * FROM students WHERE tel = ?",
    COUNT: "SELECT COUNT(*) as count FROM students",
    searchStudents: `
    SELECT id, firstname, lastname, tel 
    FROM students 
    WHERE firstname LIKE ? OR lastname LIKE ? 
    LIMIT ?
  `,
};
exports.default = QUERIES;
