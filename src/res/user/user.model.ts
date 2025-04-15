import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const user = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
    },
    descriptor: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "student"],
      default: "student",
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const UserModel = model("User", user);

type User = HydratedDocument<InferSchemaType<typeof user>>;

export type { User };
export default UserModel;
