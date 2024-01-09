import { AnyZodObject, z } from "zod";
import Exception from "../lib/Exception";
import { NextFunction, Request, Response } from "express";

export default function schemaParser<T extends z.ZodTypeAny = AnyZodObject>(
  schema: T
) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const unparsed = { body: req.body, params: req.params, query: req.query };

      schema.parse(unparsed);

      next();
    } catch (error: any) {
      const msg = error.issues.map((issue: any) => issue.message);
      throw new Exception({ code: 400, message: msg[0] });
    }
  };
}
