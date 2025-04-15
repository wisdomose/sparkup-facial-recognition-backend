import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const course = new Schema({
  code: { type: String, lowercase: true, required: true, trim: true },
  title: { type: String, lowercase: true, required: true, trim: true },
  unit: { type: Number, required: true },
  grade: { type: Number, required: true },
});

const result = new Schema(
  {
    semester: { type: String, required: true },
    session: { type: String, required: true },
    courses: {
      type: [course],
      required: true,
    },
    studentId: { type: Types.ObjectId, ref: "User", required: true },
    uploadedById: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    strict: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    virtuals: {
      student: {
        options: {
          ref: "User",
          localField: "studentId",
          foreignField: "_id",
          justOne: true,
        },
      },
      uploadedBy: {
        options: {
          ref: "User",
          localField: "uploadedById",
          foreignField: "_id",
          justOne: true,
        },
      },
    },
  }
);

const ResultModel = model("Result", result);

type Result = HydratedDocument<InferSchemaType<typeof result>>;
type Course = HydratedDocument<InferSchemaType<typeof course>>;
type RawCourse = InferSchemaType<typeof course>;

export type { Result, Course, RawCourse };
export { ResultModel };
