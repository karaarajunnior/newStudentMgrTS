export const coursequeries = {
	courseTable: `
    CREATE TABLE IF NOT EXISTS courses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      course_unit VARCHAR(50) NOT NULL,
      code VARCHAR(20) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,

	enrollmentTable: `
    CREATE TABLE IF NOT EXISTS student_courses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT NOT NULL,
      course_id INT NOT NULL,
      enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      UNIQUE KEY unique_enrollment (student_id, course_id)
    )
  `,

	getCourses: `
    SELECT 
      c.id, 
      c.course_unit, 
      c.code,
      sc.enrollment_date, 
      sc.status
    FROM courses c
    JOIN student_courses sc ON c.id = sc.course_id
    WHERE sc.student_id = ?
  `,

	getCourse: "SELECT * FROM courses WHERE id = ?",
	createCourse: `
    INSERT INTO courses (id, course_unit, code) 
    VALUES (?, ?, ?)
  `,
	updateCourse: `
    UPDATE courses 
    SET course_unit = ?, code = ? 
    WHERE id = ?
  `,
	deleteCourse: "DELETE FROM courses WHERE id = ?",

	checkEnrollment: `
    SELECT * FROM student_courses 
    WHERE student_id = ? AND course_id = ?
  `,
	newEnrollment: `
    INSERT INTO student_courses (student_id, course_id) 
    VALUES (?, ?)
  `,
	updateEnrollment: `
    UPDATE student_courses 
    SET status = ? 
    WHERE student_id = ? AND course_id = ?
  `,
	removeEnrollment: `
    DELETE FROM student_courses 
    WHERE student_id = ? AND course_id = ?
  `,
	getStudentEnrollments: `
    SELECT 
      sc.*, 
      c.course_unit, 
      c.code 
    FROM student_courses sc
    JOIN courses c ON sc.course_id = c.id 
    WHERE sc.student_id = ?
  `,
	getCourseEnrollments: `
    SELECT 
      sc.*, 
      s.firstname, 
      s.lastname, 
      s.tel 
    FROM student_courses sc
    JOIN students s ON sc.student_id = s.id 
    WHERE sc.course_id = ?
  `,
	getCourseStats: `
    SELECT 
      COUNT(*) as total_enrollments,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_enrollments,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_enrollments,
      COUNT(CASE WHEN status = 'dropped' THEN 1 END) as dropped_enrollments
    FROM student_courses 
    WHERE course_id = ?
  `,
	searchCourses: `
    SELECT * FROM courses 
    WHERE course_unit LIKE ? 
    OR code LIKE ?
    LIMIT ?
  `,
};
