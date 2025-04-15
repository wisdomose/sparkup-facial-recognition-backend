import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const semester = new Schema(
  {
    session: { type: String, lowercase: true, required: true, trim: true },
    semester: {
      type: String,
      enum: ["first", "second"],
      required: true,
      trim: true,
    },
    results: {
      type: [{ type: Types.ObjectId, ref: "Result" }],
      required: true,
    },
    studentId: { type: Types.ObjectId, ref: "User", required: true },
    // totalUnit: { type: Number, required: true },
    // totalGrade: { type: Number, required: true },
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
      // uploadedBy: {
      //   options: {
      //     ref: "User",
      //     localField: "uploadedById",
      //     foreignField: "_id",
      //     justOne: true,
      //   },
      // },
    },
  }
);

const SemesterModel = model("Semester", semester);

type Semester = HydratedDocument<InferSchemaType<typeof semester>>;

export type { Semester };
export { SemesterModel };
