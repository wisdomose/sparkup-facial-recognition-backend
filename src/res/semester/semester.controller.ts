import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import { UserLocal } from "../../types/global";
import { Types } from "mongoose";
import { SemesterSchema } from "./semester.schema";
import semesterService from "./semester.service";

// create semester
export async function createSemester(
  req: Request<{}, {}, SemesterSchema["CreateSemester"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, results, studentId } = req.body;
    const uploadedById = res.locals.user._id;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to create this semester",
        code: 403,
      });
    }

    const existingSemester = await semesterService.findOne({
      session,
      semester,
      studentId,
    });

    if (existingSemester) {
      throw new Exception({
        message: "Semester already exists",
        code: 400,
      });
    }

    const result = await semesterService.createOne({
      session,
      semester,
      results,
      studentId: new Types.ObjectId(studentId),
      uploadedById: new Types.ObjectId(uploadedById),
    });

    return res
      .status(201)
      .json({ data: result.toObject(), message: "Semester created" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to create semester",
      code: error?.code ?? 400,
    });
  }
}

// find one semester
export async function findOneSemester(
  req: Request<{}, {}, {}, SemesterSchema["FindOneSemester"]["query"]>,
  res: Response
) {
  try {
    const { session, semester, studentId } = req.query;

    const semesterData = await semesterService.findOne({
      session,
      semester,
      studentId,
    });

    if (!semesterData) {
      return res.status(404).json({ message: "Semester not found" });
    }

    return res
      .status(200)
      .json({ data: semesterData.toObject(), message: "Semester found" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find semester",
      code: error?.code ?? 400,
    });
  }
}

// find all semesters
export async function findAllSemesters(
  req: Request<{}, {}, {}, SemesterSchema["FindAllSemesters"]["query"]>,
  res: Response
) {
  try {
    const { studentId } = req.query;

    const semesters = await semesterService.findAll({
      studentId,
    });

    return res.status(200).json({
      data: semesters.map((semester) => semester.toObject()),
      message: "Semesters found",
    });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to find semesters",
      code: error?.code ?? 400,
    });
  }
}

// update semester
export async function updateSemester(
  req: Request<{}, {}, SemesterSchema["UpdateSemester"]["body"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, studentId, results } = req.body;
    const uploadedById = res.locals.user._id;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to update this semester",
        code: 403,
      });
    }

    const semesterData = await semesterService.findOne({
      session,
      semester,
      studentId,
    });

    if (!semesterData) {
      throw new Exception({
        message: "Semester not found",
        code: 404,
      });
    }

    const updatedSemester = await semesterService.updateOne(
      {
        _id: semesterData._id,
        uploadedById,
      },
      {
        session,
        semester,
        results: results.map((result) => new Types.ObjectId(result)),
        uploadedById,
      }
    );

    if (!updatedSemester) {
      throw new Exception({
        message: "Failed to update semester",
        code: 400,
      });
    }

    return res
      .status(200)
      .json({ data: updatedSemester.toObject(), message: "Semester updated" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to update semester",
      code: error?.code ?? 400,
    });
  }
}

// delete semester
export async function deleteSemester(
  req: Request<{}, {}, {}, SemesterSchema["DeleteSemester"]["query"]>,
  res: Response<{}, { user: UserLocal }>
) {
  try {
    const { session, semester, studentId } = req.query;

    if (res.locals.user.role !== "admin") {
      throw new Exception({
        message: "You are not authorized to delete this semester",
        code: 403,
      });
    }

    const semesterData = await semesterService.findOne({
      session,
      semester,
      studentId,
    });

    if (!semesterData) {
      throw new Exception({
        message: "Semester not found",
        code: 404,
      });
    }

    await semesterService.deleteOne({
      _id: semesterData._id,
    });

    return res.status(200).json({ message: "Semester deleted" });
  } catch (error: any) {
    throw new Exception({
      message: error?.message ?? "Failed to delete semester",
      code: error?.code ?? 400,
    });
  }
}
