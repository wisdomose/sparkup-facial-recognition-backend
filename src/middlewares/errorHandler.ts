import { NextFunction, Request, Response } from "express";
import Exception from "../lib/Exception";
import logger from "../lib/logger";

export function errorMiddleware(
  error: Exception,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.message);
  return res
    .status(error.code ?? 400)
    .json({
      code: error.code,
      message: error.message,
    })
    .end();
}
