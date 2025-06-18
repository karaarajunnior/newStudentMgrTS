import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentROutes";
import courseRoutes from "./routes/courseRoutes";
import lecturerRoutes from "./routes/lecturerRoutes";
import emailRoutes from "./routes/inviteRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "../src/middleware/errorHandler";

dotenv.config();
const app = express();

export class App {
	private readonly app: Application;
	private readonly APPLICATION_RUNNING = "application is running on";

	constructor(
		private readonly port: string | number = process.env.SERVER_PORT || 5000,
	) {
		this.app = express();
		this.middleware();
		this.routes();
	}

	listen() {
		this.app.listen(this.port);
		console.log(`${this.APPLICATION_RUNNING} port ${this.port}`);
	}

	private middleware() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(errorHandler);
	}

	private routes() {
		this.app.use("/api/students", studentRoutes);
		this.app.use("/api/courses", courseRoutes);
		this.app.use("/api/lecturer", lecturerRoutes);
		this.app.use("/api/auth", authRoutes);
		this.app.use("/api/email", emailRoutes);
		this.app.get("/api/health", (req, res) => {
			res.send("good to go");
		});
	}
}
