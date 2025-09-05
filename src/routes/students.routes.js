import { createStudent } from "../controllers/students.controllers.js";
import { Router } from "express"
import {defaultStudentValidator} from "../middlewares/validate/studen.validate.js"
import { validateResult } from "../middlewares/validateResult.js"

const router = Router()

router.post("/student", defaultStudentValidator,validateResult,createStudent)

export default router