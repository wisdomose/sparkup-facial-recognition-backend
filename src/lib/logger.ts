import pino from "pino";

const logger =
  process.env.NODE_ENV === "development"
    ? pino({
        transport: {
          target: "pino-pretty",
        },
      })
    : pino();

export default logger;
