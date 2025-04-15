import { FilterQuery, ProjectionType, QueryOptions, Types } from "mongoose";
import logger from "../../lib/logger";
import type { Semester } from "./semester.model";
import { SemesterModel } from "./semester.model";

async function init() {
  logger.info("Semester initialization");
  await SemesterModel.syncIndexes();
  logger.info("Semester initialization complete");
}

async function findOne(
  filter?: FilterQuery<Semester>,
  projection?: ProjectionType<Semester>
) {
  const result = await SemesterModel.findOne(filter, projection);
  return result;
}

async function findAll(
  filter: FilterQuery<Semester>,
  projection?: ProjectionType<Semester>,
  options?: QueryOptions
) {
  const result = await SemesterModel.find(filter, projection, options);
  return result;
}

async function createOne(
  data: Pick<Semester, "session" | "semester"> & {
    studentId: string | Types.ObjectId;
    uploadedById: string | Types.ObjectId;
    results: string[] | Types.ObjectId[];
  }
) {
  const result = await SemesterModel.create(data);
  return result;
}

async function updateOne(
  filter: FilterQuery<
    Semester & {
      uploadedById: string | Types.ObjectId;
    }
  >,
  data: Partial<
    Omit<Semester, "uploadedById" | "results"> & {
      uploadedById: string | Types.ObjectId;
      results: string[] | Types.ObjectId[];
    }
  >,
  options?: QueryOptions<Semester>
) {
  const result = await SemesterModel.findOneAndUpdate(filter, data, options);
  return result;
}

async function deleteOne(filter: FilterQuery<Semester>) {
  const result = await SemesterModel.findOneAndDelete(filter);
  return result;
}

async function countDocuments(filter: FilterQuery<Semester>) {
  const result = await SemesterModel.countDocuments(filter);
  return result;
}

const resultService = {
  init,
  findOne,
  findAll,
  createOne,
  updateOne,
  deleteOne,
  countDocuments,
};

export default resultService;
