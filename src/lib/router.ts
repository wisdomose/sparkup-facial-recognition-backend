import { Application } from "express";
import userRouter from "../res/user/user.router";
import authRouter from "../res/auth/auth.router";
import airtimeRouter from "../res/airtime/airtime.router";
import contactRouter from "../res/contact/contact.router";

export default function router(app: Application) {
  app.get("/status", (req, res) => {
    return res.send(200);
  });
  app.use("/user", userRouter());
  app.use("/auth", authRouter());
  app.use("/airtime", airtimeRouter());
  app.use("/contacts", contactRouter());
}
