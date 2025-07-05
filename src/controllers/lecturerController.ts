import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import HttpResponse from "../utils/HttpResponse";
import lecturerService from "../services/lecturerService";

export const addlecturer = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const lecturer = await lecturerService.createlecturer(
		req.body.name,
		req.body.role,
	);

	HttpResponse.success(res, 201, "lecturer created successfully", lecturer);
};

//upload files

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "/uploads"));
	},
	filename: function (req, file, cb) {
		const extname = path.extname(file.originalname);
		cb(null, file.fieldname + "_" + Date.now() + extname);
	},
});

const fileFilter = (req, file, cb) => {
	const filetypes = /pdf|doc|docx|svg|ppt|pptx/;
	const mimetypes =
		/application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/svg\+xml|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation/;
	const extname = path.extname(file.originalname);
	const mimetype = file.mimetype;

	if (filetypes.test(extname) && mimetypes.test(mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("failure"), false);
	}
};

const upload = multer({ storage, fileFilter });

const uploadSingleFile = upload.single("file");
const uploadManyFiles = upload.array("file");

export const handleMany = (req: Request, res: Response) => {
	uploadManyFiles(req, res, (error: unknown) => {
		if (error) {
			res.status(400).json({ msg: "failed to upload" });
		} else if (req.files) {
			res.status(200).json({ success: true, message: "uploaded successfully" });
		} else {
			res.status(400).json({ msg: "image not found" });
		}
	});
};

export const handleSingleFile = (req: Request, res: Response) => {
	uploadSingleFile(req, res, (error) => {
		if (error) {
			res.status(400).json({ msg: "failed to upload" });
		} else if (req.file) {
			res.status(200).json({ success: true, message: "uploaded successfully" });
		} else {
			res.status(400).json({ msg: "image not found" });
		}
	});
};
