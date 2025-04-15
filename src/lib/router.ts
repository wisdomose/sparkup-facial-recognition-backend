import { Application } from "express";
import userRouter from "../res/user/user.router";
import semesterRouter from "../res/semester/semester.router";
import resultRouter from "../res/result/result.router";

export default function router(app: Application) {
  app.get("/status", (req, res) => {
    return res.send(200);
  });
  app.use("/user", userRouter());
  app.use("/semester", semesterRouter());
  app.use("/result", resultRouter());
}
