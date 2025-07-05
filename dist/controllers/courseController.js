"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const CourseService_1 = __importDefault(require("../services/CourseService"));
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const getCourseById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    const course = await CourseService_1.default.getCourseById(id);
    if (!course) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    return res.json(HttpResponse_1.default.success(res, 200, "Course retrieved successfully", course));
};
const getAllCourses = (0, express_async_handler_1.default)(async (req, res) => {
    const courses = await CourseService_1.default.getAllCourses();
    HttpResponse_1.default.success(res, 200, "All courses retrieved successfully", {
        count: courses.length,
        courses,
    });
});
const getStudentCourses = async (req, res) => {
    const { studentId } = req.params;
    if (!studentId) {
        return HttpResponse_1.default.error(res, 400, "Student ID is required");
    }
    const courses = await CourseService_1.default.getStudentCourses(studentId);
    HttpResponse_1.default.success(res, 200, "Student courses retrieved successfully", {
        count: courses.length,
        courses,
    });
};
const getCourseByCode = async (req, res) => {
    const { student_id } = req.params;
    if (!student_id) {
        return HttpResponse_1.default.error(res, 400, "Course code is required");
    }
    const course = await CourseService_1.default.getCourseByCode(student_id);
    if (!course) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    HttpResponse_1.default.success(res, 200, "Course retrieved successfully", course);
};
const createCourse = async (req, res) => {
    const { course_unit, code, lecturer_id, student_id } = req.body;
    if (!course_unit || !code) {
        return HttpResponse_1.default.error(res, 400, "Course unit and code are required");
    }
    try {
        const result = await CourseService_1.default.createCourse({
            course_unit,
            code,
            lecturer_id,
            student_id,
        });
        HttpResponse_1.default.success(res, 201, "Course created successfully", {
            id: result.id,
            course_unit: result.course_unit,
            code: result.code,
        });
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to create course");
    }
};
const updateCourse = async (req, res) => {
    const { courseId, id } = req.params;
    const courseIdParam = courseId || id;
    const { course_unit, code, lecturer_id } = req.body;
    if (!courseIdParam) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    const existingCourse = await CourseService_1.default.getCourseById(courseIdParam);
    if (!existingCourse) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    try {
        const result = await CourseService_1.default.updateCourse(courseIdParam, {
            course_unit,
            code,
            lecturer_id,
            created_at: existingCourse.created_at,
        });
        if (!result) {
            return HttpResponse_1.default.error(res, 404, "Course not found or update failed");
        }
        HttpResponse_1.default.success(res, 200, "Course updated successfully", result);
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to update course");
    }
};
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const courseIdParam = id;
    if (!courseIdParam) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    const existingCourse = await CourseService_1.default.getCourseById(courseIdParam);
    if (!existingCourse) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    try {
        const message = await CourseService_1.default.deleteCourse(courseIdParam);
        HttpResponse_1.default.success(res, 200, message);
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to delete course");
    }
};
const enrollInCourse = async (req, res, next) => {
    const { course_id, student_id } = req.body;
    if (!course_id) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    const courseExists = await CourseService_1.default.validateCourseExists(course_id);
    if (!courseExists) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    try {
        await CourseService_1.default.enrollStudent(student_id, course_id);
        HttpResponse_1.default.success(res, 200, "Enrollment successful", {
            message: "You have been successfully enrolled in the course",
        });
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to enroll in course");
    }
};
const enrollStudent = async (req, res, next) => {
    const { courseId } = req.params;
    const { studentId, lecturerId } = req.body;
    if (!courseId || !studentId) {
        return HttpResponse_1.default.error(res, 400, "Course ID and Student ID are required");
    }
    try {
        const enrollment = await CourseService_1.default.enrollStudent(studentId, courseId, lecturerId);
        HttpResponse_1.default.success(res, 201, "Student enrolled successfully", enrollment);
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to enroll student");
    }
};
const unenrollFromCourse = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.user.id;
    if (!courseId) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    try {
        await CourseService_1.default.unenrollStudent(studentId, courseId);
        HttpResponse_1.default.success(res, 200, "Unenrollment successful", {
            message: "You have been successfully unenrolled from the course",
        });
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to unenroll from course");
    }
};
const unenrollStudent = async (req, res) => {
    const { courseId } = req.params;
    const { studentId } = req.body;
    if (!courseId || !studentId) {
        return HttpResponse_1.default.error(res, 400, "Course ID and Student ID are required");
    }
    try {
        await CourseService_1.default.unenrollStudent(studentId, courseId);
        HttpResponse_1.default.success(res, 200, "Student unenrolled successfully");
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to unenroll student");
    }
};
const updateEnrollment = async (req, res, next) => {
    const { studentId, courseId } = req.params;
    const { status } = req.body;
    if (!courseId || !studentId || !status) {
        return HttpResponse_1.default.error(res, 400, "courseId, studentId, and status are required");
    }
    const validStatuses = ["active", "completed", "dropped"];
    if (!validStatuses.includes(status.toLowerCase())) {
        return HttpResponse_1.default.error(res, 400, "Invalid status");
    }
    try {
        const updatedEnrollment = await CourseService_1.default.updateEnrollment(studentId, courseId, status);
        HttpResponse_1.default.success(res, 200, "Enrollment updated successfully", updatedEnrollment);
    }
    catch (error) {
        HttpResponse_1.default.error(res, 400, error.message || "Failed to update enrollment");
    }
};
const getEnrollmentStatus = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.user.id;
    if (!courseId) {
        return HttpResponse_1.default.error(res, 400, "CourseId is required");
    }
    const enrollment = await CourseService_1.default.getEnrollmentStatus(studentId, courseId);
    HttpResponse_1.default.success(res, 200, "Enrollment status retrieved", {
        enrolled: !!enrollment,
        enrollment: enrollment || null,
    });
};
const checkEnrollment = async (req, res, next) => {
    const { courseId, studentId } = req.params;
    if (!courseId || !studentId) {
        return HttpResponse_1.default.error(res, 400, "courseID and studentID are required");
    }
    const enrollment = await CourseService_1.default.checkEnrollment(studentId, courseId);
    if (!enrollment) {
        return HttpResponse_1.default.error(res, 404, "Enrollment not found");
    }
    HttpResponse_1.default.success(res, 200, "Enrollment found", enrollment);
};
const getCourseEnrollments = async (req, res, next) => {
    const { courseId } = req.params;
    if (!courseId) {
        return HttpResponse_1.default.error(res, 400, "courseId is required");
    }
    const enrollments = await CourseService_1.default.getCourseEnrollments(courseId);
    HttpResponse_1.default.success(res, 200, "Course enrollments retrieved", {
        count: enrollments.length,
        enrollments,
    });
};
const searchCourses = async (req, res, next) => {
    const { search, q, limit } = req.query;
    const searchTerm = search || q;
    if (!searchTerm || typeof searchTerm !== "string") {
        return HttpResponse_1.default.error(res, 400, "Search term is required");
    }
    const searchLimit = limit ? parseInt(limit) : 10;
    const courses = await CourseService_1.default.searchCourses(searchTerm, searchLimit);
    HttpResponse_1.default.success(res, 200, "Courses found", {
        count: courses.length,
        courses,
    });
};
const getEnrollmentsByStudent = async (req, res, next) => {
    const { studentId } = req.params;
    if (!studentId) {
        return HttpResponse_1.default.error(res, 400, "studentId is required");
    }
    const enrollments = await CourseService_1.default.getEnrollmentsByStudent(studentId);
    HttpResponse_1.default.success(res, 200, "Student enrollments retrieved", {
        count: enrollments.length,
        enrollments,
    });
};
const getCourseStats = async (req, res, next) => {
    const { courseId } = req.params;
    if (!courseId) {
        return HttpResponse_1.default.error(res, 400, "Course ID is required");
    }
    const stats = await CourseService_1.default.getCourseStats(courseId);
    if (!stats) {
        return HttpResponse_1.default.error(res, 404, "Course not found");
    }
    HttpResponse_1.default.success(res, 200, "Course stats retrieved", stats);
};
const validateCourseExists = async (req, res, next) => {
    const { courseId } = req.params;
    if (!courseId) {
        return HttpResponse_1.default.error(res, 400, "courseId is required");
    }
    const exists = await CourseService_1.default.validateCourseExists(courseId);
    HttpResponse_1.default.success(res, 200, exists ? "Course exists" : "Course not found", {
        exists,
    });
};
exports.default = {
    getAllCourses,
    getStudentCourses,
    getCourseById,
    getCourseByCode,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    enrollStudent,
    unenrollFromCourse,
    unenrollStudent,
    updateEnrollment,
    getEnrollmentStatus,
    checkEnrollment,
    getCourseEnrollments,
    searchCourses,
    getEnrollmentsByStudent,
    getCourseStats,
    validateCourseExists,
};
