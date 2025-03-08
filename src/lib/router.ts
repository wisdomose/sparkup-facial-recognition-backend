import { Application } from "express";
import userRouter from "../res/user/user.router";

export default function router(app: Application) {
  app.get("/status", (req, res) => {
    return res.send(200);
  });
  app.use("/user", userRouter());
}
