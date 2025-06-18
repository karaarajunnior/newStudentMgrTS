"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCourses = async () => {
    const rows = await prisma.courses.findMany({
        select: {
            id: true,
            course_unit: true,
            code: true,
            lecturer_id: true,
            created_at: true,
            _count: {
                select: {
                    student_courses: true,
                },
            },
        },
    });
    return rows;
};
const getStudentCourses = async (studentId) => {
    const rows = await prisma.courses.findMany({
        where: {
            id: studentId,
        },
        select: {
            id: true,
            course_unit: true,
            code: true,
            lecturer_id: true,
            created_at: true,
        },
    });
    return rows;
};
const getCourseById = async (courseId) => {
    const rows = await prisma.courses.findUnique({
        where: {
            id: courseId,
        },
        include: {
            student_courses: {
                select: {
                    student_id: true,
                    status: true,
                    enrollment_date: true,
                },
            },
        },
    });
    return rows;
};
const createCourse = async (courseData) => {
    const { course_unit, code, created_at, lecturer_id } = courseData;
    if (!course_unit || !code) {
        throw new Error("Course unit and code are mandatory");
    }
    const existingCourse = await getCourseByCode(code);
    if (existingCourse) {
        throw new Error("Course with this code already exists");
    }
    const result = await prisma.courses.create({
        data: {
            course_unit,
            code,
            created_at: new Date(),
            lecturer_id,
        },
    });
    return result;
};
const getCourseByCode = async (code) => {
    const rows = await prisma.courses.findUnique({
        where: { code: code },
    });
    return rows;
};
const updateCourse = async (courseId, courseData) => {
    const { course_unit, code, created_at, lecturer_id } = courseData;
    const result = await prisma.courses.update({
        where: {
            id: courseId,
        },
        data: {
            course_unit,
            code,
            created_at,
            lecturer_id,
        },
    });
    return result;
};
const deleteCourse = async (courseId) => {
    const enrollments = await prisma.student_courses.findMany({
        where: { course_id: courseId },
    });
    if (enrollments.length > 0) {
        throw new Error("Cannot delete course with existing enrollments");
    }
    const result = await prisma.courses.delete({
        where: {
            id: courseId,
        },
    });
    return "Course deleted successfully";
};
const checkEnrollment = async (studentId, courseId) => {
    const rows = await prisma.student_courses.findFirst({
        where: {
            course_id: courseId,
            student_id: studentId,
        },
        select: {
            id: true,
            student_id: true,
            course_id: true,
            lecturer_id: true,
            status: true,
            enrollment_date: true,
        },
    });
    return rows;
};
const getEnrollmentStatus = async (studentId, courseId) => {
    const enrollment = await prisma.student_courses.findFirst({
        where: {
            student_id: studentId,
            course_id: courseId,
        },
        select: {
            status: true,
            enrollment_date: true,
        },
    });
    return enrollment;
};
const enrollStudent = async (studentId, courseId, lecturerId) => {
    const existingEnrollment = await checkEnrollment(studentId, courseId);
    if (existingEnrollment) {
        throw new Error("Student is already enrolled in this course");
    }
    const course = await getCourseById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }
    const result = await prisma.student_courses.create({
        data: {
            student_id: studentId,
            course_id: courseId,
            lecturer_id: lecturerId || course.lecturer_id,
            status: "active",
            enrollment_date: new Date(),
        },
    });
    return result;
};
const unenrollStudent = async (studentId, courseId) => {
    const existingEnrollment = await checkEnrollment(studentId, courseId);
    if (!existingEnrollment) {
        throw new Error("Student is not enrolled in this course");
    }
    const result = await prisma.student_courses.delete({
        where: {
            id: existingEnrollment.id,
        },
    });
    return result;
};
const updateEnrollment = async (studentId, courseId, status) => {
    const existingEnrollment = await checkEnrollment(studentId, courseId);
    if (!existingEnrollment) {
        throw new Error("Enrollment not found");
    }
    const result = await prisma.student_courses.update({
        where: {
            id: existingEnrollment.id,
        },
        data: {
            status,
        },
    });
    return result;
};
const getCourseEnrollments = async (courseId) => {
    const enrollments = await prisma.student_courses.findMany({
        where: { course_id: courseId },
        include: {
            student: {
                select: {
                    id: true,
                    firstname: true,
                    email: true,
                    tel: true,
                },
            },
        },
    });
    return enrollments;
};
const searchCourses = async (searchTerm, limit = 10) => {
    const courses = await prisma.courses.findMany({
        where: {
            OR: [
                {
                    course_unit: {
                        contains: searchTerm.toLowerCase(),
                    },
                },
                {
                    code: {
                        equals: searchTerm.toLowerCase(),
                    },
                },
            ],
        },
        take: limit,
        include: {
            _count: {
                select: {
                    student_courses: true,
                },
            },
        },
    });
    return courses;
};
const getEnrollmentsByStudent = async (studentId) => {
    const enrollments = await prisma.student_courses.findMany({
        where: { student_id: studentId },
        include: {
            course: {
                select: {
                    id: true,
                    course_unit: true,
                    code: true,
                    lecturer_id: true,
                },
            },
        },
        orderBy: {
            enrollment_date: "desc",
        },
    });
    return enrollments;
};
const validateCourseExists = async (courseId) => {
    const course = await getCourseById(courseId);
    return course !== null;
};
const getCourseStats = async (courseId) => {
    const course = await prisma.courses.findUnique({
        where: { id: courseId },
        include: {
            _count: {
                select: {
                    student_courses: true,
                },
            },
            student_courses: {
                select: {
                    status: true,
                },
            },
        },
    });
    if (!course) {
        return null;
    }
    const activeEnrollments = course.student_courses.filter((enrollment) => enrollment.status === "active").length;
    const inactiveEnrollments = course.student_courses.filter((enrollment) => enrollment.status === "completed" || "dropped").length;
    return {
        course_id: course.id,
        course_unit: course.course_unit,
        code: course.code,
        total_enrollments: course._count.student_courses,
        active_enrollments: activeEnrollments,
        inactive_enrollments: inactiveEnrollments,
    };
};
exports.default = {
    getAllCourses,
    validateCourseExists,
    updateEnrollment,
    enrollStudent,
    unenrollStudent,
    checkEnrollment,
    getEnrollmentStatus,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCourseByCode,
    getStudentCourses,
    getCourseEnrollments,
    searchCourses,
    getEnrollmentsByStudent,
    getCourseStats,
};
