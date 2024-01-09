import { HydratedDocument } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const user = new Schema(
  {},
  {
    strict: true,
    timestamps: true,
  }
);

const User = model("User", user);

type User = HydratedDocument<InferSchemaType<typeof user>>;

export type { User };
export default User;
