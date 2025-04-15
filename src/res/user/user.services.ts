import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import logger from "../../lib/logger";
import UserModel, { User } from "./user.model";

async function init() {
  logger.info("User initialization");
  await UserModel.syncIndexes();
  logger.info("User initialization complete");
}

async function findOne(
  filter?: FilterQuery<User>,
  projection?: ProjectionType<User>
) {
  const result = await UserModel.findOne(filter, projection);
  return result;
}

async function findAll(
  filter: FilterQuery<User>,
  projection?: ProjectionType<User>,
  options?: QueryOptions
) {
  const result = await UserModel.find(filter, projection, options);
  return result;
}

async function createOne(
  data: Pick<User, "email" | "fullname" | "descriptor">
) {
  const result = await UserModel.create(data);
  return result;
}

async function updateOne(
  filter: FilterQuery<User>,
  data: Partial<User>,
  options?: QueryOptions<User>
) {
  const result = await UserModel.findOneAndUpdate(filter, data, options);
  return result;
}

async function deleteOne(filter: FilterQuery<User>) {
  const result = await UserModel.findOneAndDelete(filter);
  return result;
}

async function countDocuments(filter: FilterQuery<User>) {
  const result = await UserModel.countDocuments(filter);
  return result;
}

const userService = {
  init,
  findOne,
  findAll,
  createOne,
  updateOne,
  deleteOne,
  countDocuments,
};

export default userService;
