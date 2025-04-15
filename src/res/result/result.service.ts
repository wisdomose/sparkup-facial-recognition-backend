import { FilterQuery, ProjectionType, QueryOptions, Types } from "mongoose";
import logger from "../../lib/logger";
import type { RawCourse, Result } from "./result.model";
import { ResultModel } from "./result.model";

async function init() {
  logger.info("Result initialization");
  await ResultModel.syncIndexes();
  logger.info("Result initialization complete");
}

async function findOne(
  filter?: FilterQuery<Result>,
  projection?: ProjectionType<Result>
) {
  const result = await ResultModel.findOne(filter, projection);
  return result;
}

async function findAll(
  filter: FilterQuery<Result>,
  projection?: ProjectionType<Result>,
  options?: QueryOptions
) {
  const result = await ResultModel.find(filter, projection, options);
  return result;
}

async function createOne(
  data: Pick<Result, "session" | "semester"> & {
    courses: RawCourse[];
    studentId: string | Types.ObjectId;
    uploadedById: string | Types.ObjectId;
  }
) {
  const result = await ResultModel.create(data);
  return result;
}

async function updateOne(
  filter: FilterQuery<Result>,
  data: Partial<
    Omit<Result, "courses"> & {
      courses: RawCourse[];
      uploadedById: string | Types.ObjectId;
      studentId: string | Types.ObjectId;
    }
  >,
  options?: QueryOptions<Result>
) {
  const result = await ResultModel.findOneAndUpdate(filter, data, options);
  return result;
}

async function deleteOne(filter: FilterQuery<Result>) {
  const result = await ResultModel.findOneAndDelete(filter);
  return result;
}

async function countDocuments(filter: FilterQuery<Result>) {
  const result = await ResultModel.countDocuments(filter);
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
