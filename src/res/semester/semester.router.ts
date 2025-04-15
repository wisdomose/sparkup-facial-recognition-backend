import { Router } from "express";
import semesterSchema from "./semester.schema";
import schemaValidator from "../../middlewares/schemaValidator";
import { createSemester, deleteSemester, findAllSemesters, updateSemester } from "./semester.controller";

export default function semesterRouter() {
  const router = Router();

  router.post(
    "/",
    schemaValidator(semesterSchema.createSemesterSchema),
    createSemester      
  );

  router.get(
    "/",
    schemaValidator(semesterSchema.findAllSchema),
    findAllSemesters
  );

  router.put(
    "/",
    schemaValidator(semesterSchema.updateSemesterSchema),
    updateSemester
  );

  router.delete(
    "/",
    schemaValidator(semesterSchema.deleteSemesterSchema),
    deleteSemester
  );

  return router;
}
