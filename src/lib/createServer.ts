import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./router";
import { errorMiddleware } from "../middlewares/errorHandler";
import { loadModels } from "./helpers";

const app = express();

loadModels()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

router(app);
app.use(errorMiddleware);

export default app;
