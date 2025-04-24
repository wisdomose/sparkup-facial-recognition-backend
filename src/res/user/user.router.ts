import { Router } from "express";
import { findAll, findOne, login, signup, update } from "./user.controller";
import multer from "multer";
import path from "path";
import schemaValidator from "../../middlewares/schemaValidator";
import userSchema from "./user.schema";
import protectedRoute from "../../middlewares/protectedRoute";
export default function userRouter() {
  const router = Router();

  const upload = multer({ dest: path.join(__dirname, "../../uploads") });

  router.post("/signup", schemaValidator(userSchema.createUserSchema), signup);
  router.post("/login", schemaValidator(userSchema.loginUserSchema), login);

  router.get(
    "/:id",
    protectedRoute,
    schemaValidator(userSchema.findOneUserSchema),
    findOne
  );
  router.get(
    "/",
    protectedRoute,
    schemaValidator(userSchema.findAllUsersSchema),
    findAll
  );
  router.put(
    "/",
    protectedRoute,
    schemaValidator(userSchema.updateUserSchema),
    update
  );

  return router;
}
