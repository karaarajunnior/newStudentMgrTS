"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addlecturer = void 0;
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const lecturerService_1 = __importDefault(require("../services/lecturerService"));
const addlecturer = async (req, res) => {
    const lecturer = await lecturerService_1.default.createlecturer(req.body.name, req.body.role);
    HttpResponse_1.default.success(res, 201, "lecturer created successfully", lecturer);
};
exports.addlecturer = addlecturer;
