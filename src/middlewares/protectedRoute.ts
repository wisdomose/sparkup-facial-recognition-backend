import { NextFunction, Request, Response } from "express";
import Exception from "../lib/Exception";
import jwt from "jsonwebtoken";
import User from "../res/user/user.model";

export default async function protectedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  // chech if auth header exists
  if (!auth)
    throw new Exception({ code: 400, message: "Authorization failed" });

  // decode jwt
  const decoded = jwt.decode(auth.split(" ")[1]) as {
    _id: string;
    iat: number;
    exp: number;
  } | null;
  if (!decoded)
    throw new Exception({ code: 400, message: "Authorization failed" });

  // add user data to local state
  const user = await User.findById(decoded._id, { password: 0 });
  res.locals.user = user;

  next();
}
