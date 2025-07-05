import multer from "multer";
import express, { Router } from "express";
import path, { join } from "path";

const app = express();
const port = 3400;
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		//cb(null, "/uploads");
		cb(null, path.join(__dirname, "uploads"));
	},
	filename: (req, file, cb) => {
		const extname = path.extname(file.originalname);
		cb(null, `${file.filename}-${Date.now()}${extname}`);
	},
});

const fileFilter = (req, file, cb) => {
	const filetypes = /jpe?g|png|webp|svg/;
	const mimetypes = /image\/jpe?g|image\/png|image\/webp|image\/svg\+xml/;
	const extname = path.extname(file.originalname);

	const mimetype = file.mimetype;

	if (filetypes.test(extname) && mimetypes.test(mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("image upload failed"), false);
	}
};

const upload = multer({ storage, fileFilter });
const uploadedfile = upload.single("image");

const router = Router();
const route = router.post("/upload", (req, res) => {
	uploadedfile(req, res, (err) => {
		if (err) {
			res.status(400).json({ message: "not uploaded" });
		} else if (req.file) {
			res
				.status(200)
				.json({ message: "uploaded successfully", image: `/${req.file.path}` });
		} else {
			res.status(400).json({ message: "file / image not found" });
		}
	});
});

const __dirname = path.resolve();
app.use("/uploads", express.static(join(__dirname + "/uploads")));

app.use("/api", route);

app.listen(port, () => console.log(`listening on port ${port}`));

// import express, { Router } from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const app = express();
// const port = 3400;
// const __dirname = path.resolve();

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		const uploadPath = path.join(__dirname, "uploads");
// 		if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
// 		cb(null, uploadPath);
// 	},
// 	filename: (req, file, cb) => {
// 		const extname = path.extname(file.originalname);
// 		const baseName = path.parse(file.originalname).name;
// 		cb(null, `${baseName}-${Date.now()}${extname}`);
// 	},
// });

// const fileFilter = (req, file, cb) => {
// 	const filetypes = /jpe?g|png|webp|svg/;
// 	const mimetypes = /image\/jpe?g|image\/png|image\/webp|image\/svg\+xml/;
// 	const extname = path.extname(file.originalname).toLowerCase();
// 	const mimetype = file.mimetype;

// 	if (filetypes.test(extname) && mimetypes.test(mimetype)) {
// 		cb(null, true);
// 	} else {
// 		cb(new Error("image upload failed"), false);
// 	}
// };

// const upload = multer({ storage, fileFilter });
// const uploadedfile = upload.single("image");

// const router = Router();
// router.post("/upload", (req, res) => {
// 	uploadedfile(req, res, (err) => {
// 		if (err) {
// 			res.status(400).json({ message: "not uploaded", error: err.message });
// 		} else if (req.file) {
// 			res.status(200).json({
// 				message: "uploaded successfully",
// 				image: `/uploads/${req.file.filename}`,
// 			});
// 		} else {
// 			res.status(400).json({ message: "file / image not found" });
// 		}
// 	});
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api", router);

// app.listen(port, () => console.log(`Listening on port ${port}`));
