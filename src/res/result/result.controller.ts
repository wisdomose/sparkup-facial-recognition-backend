import { Request, Response } from "express";
import { ResultSchema } from "./result.schema";
import Exception from "../../lib/Exception";
import resultService from "./result.service";
import { UserLocal } from "../../types/global";
import { Types } from "mongoose";

export async function createResult(
  req: Request<{}, {}, ResultSchema["CreateResult"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, courses, studentId } = req.body;
    const uploadedById = res.locals.user._id;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to create this result",
        code: 403,
      });
    }

    const result = await resultService.createOne({
      session,
      semester,
      courses,
      studentId: new Types.ObjectId(studentId),
      uploadedById: new Types.ObjectId(uploadedById),
    });

    return res
      .status(201)
      .json({ data: result.toObject(), message: "Result created" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to create result",
      code: error?.code ?? 400,
    });
  }
}

export async function findOneResult(
  req: Request<{}, {}, {}, ResultSchema["FindOneResult"]["query"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, studentId } = req.query;

    const result = await resultService.findOne({
      session,
      semester,
      studentId: new Types.ObjectId(studentId),
    });

    if (!result) {
      throw new Exception({
        message: "Result not found",
        code: 404,
      });
    }

    return res
      .status(200)
      .json({ data: result.toObject(), message: "Result found" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find result",
      code: error?.code ?? 400,
    });
  }
}

export async function findAllResults(
  req: Request<{}, {}, {}, ResultSchema["FindAllResults"]["query"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { studentId } = req.query;

    const results = await resultService.findAll({
      studentId: new Types.ObjectId(studentId),
    });

    return res.status(200).json({
      data: results.map((result) => result.toObject()),
      message: "Results found",
    });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find results",
      code: error?.code ?? 400,
    });
  }
}

export async function updateResult(
  req: Request<{}, {}, ResultSchema["UpdateResult"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, courses, studentId } = req.body;
    const uploadedById = res.locals.user._id;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to update this result",
        code: 403,
      });
    }

    const result = await resultService.updateOne(
      {
        session,
        semester,
        studentId: new Types.ObjectId(studentId),
      },
      {
        session,
        semester,
        courses,
        studentId: new Types.ObjectId(studentId),
        uploadedById: new Types.ObjectId(uploadedById),
      }
    );

    if (!result) {
      throw new Exception({
        message: "Result not found",
        code: 404,
      });
    }

    return res
      .status(200)
      .json({ data: result.toObject(), message: "Result updated" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to update result",
      code: error?.code ?? 400,
    });
  }
}

export async function deleteResult(
  req: Request<{}, {}, {}, ResultSchema["DeleteResult"]["query"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, studentId } = req.query;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to delete this result",
        code: 403,
      });
    }

    const result = await resultService.findOne({
      session,
      semester,
      studentId: new Types.ObjectId(studentId),
    });

    if (!result) {
      throw new Exception({
        message: "Result not found",
        code: 404,
      });
    }

    await resultService.deleteOne({
      _id: result._id,
    });

    return res.status(200).json({ message: "Result deleted" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to delete result",
      code: error?.code ?? 400,
    });
  }
}
