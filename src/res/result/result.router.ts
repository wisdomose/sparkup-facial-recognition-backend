import { Router } from "express";
import resultSchema from "./result.schema";
import schemaValidator from "../../middlewares/schemaValidator";
import {
  createResult,
  deleteResult,
  findAllResults,
  updateResult,
} from "./result.controller";

export default function resultRouter() {
  const router = Router();

  router.post(
    "/",
    schemaValidator(resultSchema.createResultSchema),
    createResult
  );

  router.get(
    "/",
    schemaValidator(resultSchema.findAllSchema),
    findAllResults
  );

  router.put(
    "/",
    schemaValidator(resultSchema.updateResultSchema),
    updateResult
  );

  router.delete(
    "/",
    schemaValidator(resultSchema.deleteResultSchema),
    deleteResult
  );

  return router;
}
