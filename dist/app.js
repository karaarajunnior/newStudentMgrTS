"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const studentROutes_1 = __importDefault(require("./routes/studentROutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const lecturerRoutes_1 = __importDefault(require("./routes/lecturerRoutes"));
const inviteRoutes_1 = __importDefault(require("./routes/inviteRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const errorHandler_1 = require("../src/middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
class App {
    port;
    app;
    APPLICATION_RUNNING = "application is running on";
    constructor(port = process.env.SERVER_PORT || 5000) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.middleware();
        this.routes();
    }
    listen() {
        this.app.listen(this.port);
        console.log(`${this.APPLICATION_RUNNING} port ${this.port}`);
    }
    middleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(errorHandler_1.errorHandler);
    }
    routes() {
        this.app.use("/api/students", studentROutes_1.default);
        this.app.use("/api/courses", courseRoutes_1.default);
        this.app.use("/api/lecturer", lecturerRoutes_1.default);
        this.app.use("/api/auth", authRoutes_1.default);
        this.app.use("/api/email", inviteRoutes_1.default);
        this.app.get("/api/health", (req, res) => {
            res.send("good to go");
        });
    }
}
exports.App = App;
