import mongoose from "mongoose";
import config from "./config";
import logger from "./logger";

export default async function connection() {
  logger.info("Establishing DB connection");
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      logger.info("DB connection sucessful");
    })
    .catch((err) => {
      logger.error(`DB connection failed - ${err.message}`);
    });
}
