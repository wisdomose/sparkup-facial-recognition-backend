import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./router";
import { errorMiddleware } from "../middlewares/errorHandler";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

router(app);
app.use(errorMiddleware);

export default app;
