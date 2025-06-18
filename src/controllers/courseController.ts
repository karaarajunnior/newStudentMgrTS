import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import CourseService from "../services/CourseService";
import HttpResponse from "../utils/HttpResponse";
import { AuthenticatedRequest } from "../types/authReq";

const getCourseById = async (req: Request, res: Response): Promise<any> => {
	const { id } = req.params;

	if (!id) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	const course = await CourseService.getCourseById(id);

	if (!course) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	return res.json(
		HttpResponse.success(res, 200, "Course retrieved successfully", course),
	);
};

const getAllCourses = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		const courses = await CourseService.getAllCourses();

		HttpResponse.success(res, 200, "All courses retrieved successfully", {
			count: courses.length,
			courses,
		});
	},
);

const getStudentCourses = async (req: Request, res: Response): Promise<any> => {
	const { studentId } = req.params;

	if (!studentId) {
		return HttpResponse.error(res, 400, "Student ID is required");
	}

	const courses = await CourseService.getStudentCourses(studentId);

	HttpResponse.success(res, 200, "Student courses retrieved successfully", {
		count: courses.length,
		courses,
	});
};

const getCourseByCode = async (req: Request, res: Response): Promise<any> => {
	const { code } = req.params;

	if (!code) {
		return HttpResponse.error(res, 400, "Course code is required");
	}

	const course = await CourseService.getCourseByCode(code);

	if (!course) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	HttpResponse.success(res, 200, "Course retrieved successfully", course);
};

const createCourse = async (req: Request, res: Response): Promise<any> => {
	const { course_unit, code, lecturer_id } = req.body;

	if (!course_unit || !code) {
		return HttpResponse.error(res, 400, "Course unit and code are required");
	}

	try {
		const result = await CourseService.createCourse({
			course_unit,
			code,
			lecturer_id,
		});

		HttpResponse.success(res, 201, "Course created successfully", {
			id: result.id,
			course_unit: result.course_unit,
			code: result.code,
		});
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to create course");
	}
};

const updateCourse = async (req: Request, res: Response): Promise<any> => {
	const { courseId, id } = req.params;
	const courseIdParam = courseId || id;
	const { course_unit, code, lecturer_id } = req.body;

	if (!courseIdParam) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	const existingCourse = await CourseService.getCourseById(courseIdParam);
	if (!existingCourse) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	try {
		const result = await CourseService.updateCourse(courseIdParam, {
			course_unit,
			code,
			lecturer_id,
			created_at: existingCourse.created_at,
		});

		if (!result) {
			return HttpResponse.error(res, 404, "Course not found or update failed");
		}

		HttpResponse.success(res, 200, "Course updated successfully", result);
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to update course");
	}
};

const deleteCourse = async (req: Request, res: Response): Promise<any> => {
	const { id } = req.params;
	const courseIdParam = id;

	if (!courseIdParam) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	const existingCourse = await CourseService.getCourseById(courseIdParam);
	if (!existingCourse) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	try {
		const message = await CourseService.deleteCourse(courseIdParam);
		HttpResponse.success(res, 200, message);
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to delete course");
	}
};

const enrollInCourse = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { course_id, student_id } = req.body;

	if (!course_id) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	const courseExists = await CourseService.validateCourseExists(course_id);
	if (!courseExists) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	try {
		await CourseService.enrollStudent(student_id, course_id);

		HttpResponse.success(res, 200, "Enrollment successful", {
			message: "You have been successfully enrolled in the course",
		});
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to enroll in course");
	}
};

const enrollStudent = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;
	const { studentId, lecturerId } = req.body;

	if (!courseId || !studentId) {
		return HttpResponse.error(
			res,
			400,
			"Course ID and Student ID are required",
		);
	}

	try {
		const enrollment = await CourseService.enrollStudent(
			studentId,
			courseId,
			lecturerId,
		);

		HttpResponse.success(res, 201, "Student enrolled successfully", enrollment);
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to enroll student");
	}
};
const unenrollFromCourse = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;
	const studentId = req.user!.id;

	if (!courseId) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	try {
		await CourseService.unenrollStudent(studentId, courseId);

		HttpResponse.success(res, 200, "Unenrollment successful", {
			message: "You have been successfully unenrolled from the course",
		});
	} catch (error: any) {
		HttpResponse.error(
			res,
			400,
			error.message || "Failed to unenroll from course",
		);
	}
};
const unenrollStudent = async (req: Request, res: Response): Promise<any> => {
	const { courseId } = req.params;
	const { studentId } = req.body;

	if (!courseId || !studentId) {
		return HttpResponse.error(
			res,
			400,
			"Course ID and Student ID are required",
		);
	}

	try {
		await CourseService.unenrollStudent(studentId, courseId);

		HttpResponse.success(res, 200, "Student unenrolled successfully");
	} catch (error: any) {
		HttpResponse.error(res, 400, error.message || "Failed to unenroll student");
	}
};

const updateEnrollment = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { studentId, courseId } = req.params;
	const { status } = req.body;

	if (!courseId || !studentId || !status) {
		return HttpResponse.error(
			res,
			400,
			"courseId, studentId, and status are required",
		);
	}

	const validStatuses = ["active", "completed", "dropped"];
	if (!validStatuses.includes(status.toLowerCase())) {
		return HttpResponse.error(res, 400, "Invalid status");
	}

	try {
		const updatedEnrollment = await CourseService.updateEnrollment(
			studentId,
			courseId,
			status,
		);

		HttpResponse.success(
			res,
			200,
			"Enrollment updated successfully",
			updatedEnrollment,
		);
	} catch (error: any) {
		HttpResponse.error(
			res,
			400,
			error.message || "Failed to update enrollment",
		);
	}
};
const getEnrollmentStatus = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;
	const studentId = req.user!.id;

	if (!courseId) {
		return HttpResponse.error(res, 400, "CourseId is required");
	}

	const enrollment = await CourseService.getEnrollmentStatus(
		studentId,
		courseId,
	);

	HttpResponse.success(res, 200, "Enrollment status retrieved", {
		enrolled: !!enrollment,
		enrollment: enrollment || null,
	});
};

const checkEnrollment = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId, studentId } = req.params;

	if (!courseId || !studentId) {
		return HttpResponse.error(res, 400, "courseID and studentID are required");
	}

	const enrollment = await CourseService.checkEnrollment(studentId, courseId);

	if (!enrollment) {
		return HttpResponse.error(res, 404, "Enrollment not found");
	}

	HttpResponse.success(res, 200, "Enrollment found", enrollment);
};

const getCourseEnrollments = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;

	if (!courseId) {
		return HttpResponse.error(res, 400, "courseId is required");
	}

	const enrollments = await CourseService.getCourseEnrollments(courseId);

	HttpResponse.success(res, 200, "Course enrollments retrieved", {
		count: enrollments.length,
		enrollments,
	});
};

const searchCourses = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { search, q, limit } = req.query;
	const searchTerm = search || q;

	if (!searchTerm || typeof searchTerm !== "string") {
		return HttpResponse.error(res, 400, "Search term is required");
	}

	const searchLimit = limit ? parseInt(limit as string) : 10;
	const courses = await CourseService.searchCourses(searchTerm, searchLimit);

	HttpResponse.success(res, 200, "Courses found", {
		count: courses.length,
		courses,
	});
};

const getEnrollmentsByStudent = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { studentId } = req.params;

	if (!studentId) {
		return HttpResponse.error(res, 400, "studentId is required");
	}

	const enrollments = await CourseService.getEnrollmentsByStudent(studentId);

	HttpResponse.success(res, 200, "Student enrollments retrieved", {
		count: enrollments.length,
		enrollments,
	});
};

const getCourseStats = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;

	if (!courseId) {
		return HttpResponse.error(res, 400, "Course ID is required");
	}

	const stats = await CourseService.getCourseStats(courseId);

	if (!stats) {
		return HttpResponse.error(res, 404, "Course not found");
	}

	HttpResponse.success(res, 200, "Course stats retrieved", stats);
};
const validateCourseExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { courseId } = req.params;

	if (!courseId) {
		return HttpResponse.error(res, 400, "courseId is required");
	}

	const exists = await CourseService.validateCourseExists(courseId);

	HttpResponse.success(
		res,
		200,
		exists ? "Course exists" : "Course not found",
		{
			exists,
		},
	);
};

export default {
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
