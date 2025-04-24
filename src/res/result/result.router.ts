import { Router } from "express";
import resultSchema from "./result.schema";
import schemaValidator from "../../middlewares/schemaValidator";
import {
  createResult,
  deleteResult,
  findAllResults,
  findOneResult,
  updateResult,
} from "./result.controller";
import protectedRoute from "../../middlewares/protectedRoute";

export default function resultRouter() {
  const router = Router();

  router.post(
    "/",
    protectedRoute,
    schemaValidator(resultSchema.createResultSchema),
    createResult
  );

  router.get(
    "/",
    protectedRoute,
    schemaValidator(resultSchema.findAllSchema),
    findAllResults
  );

  router.get(
    "/:resultId",
    protectedRoute,
    schemaValidator(resultSchema.findOneSchema),
    findOneResult
  );

  router.put(
    "/:resultId",
    protectedRoute,
    schemaValidator(resultSchema.updateResultSchema),
    updateResult
  );

  router.delete(
    "/:resultId",
    protectedRoute,
    schemaValidator(resultSchema.deleteResultSchema),
    deleteResult
  );

  return router;
}
