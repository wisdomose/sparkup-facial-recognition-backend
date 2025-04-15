import { z } from "zod";

const createUserSchema = z.object(
  {
    body: z.object(
      {
        email: z.string({ required_error: "Email is required" }).email(),
        fullname: z
          .string({ required_error: "Name is required" })
          .min(3, "Name is too short"),
        descriptor: z.array(z.any()).length(5, "Descriptor is required"),
        role: z.enum(["admin", "student"]),
      },
      { required_error: "Required fields are missing" }
    ),
  },
  { required_error: "Required fields are missing" }
);

const loginUserSchema = z.object(
  {
    body: z.object(
      {
        face: z.string({ required_error: "Face is required" }),
      },
      { required_error: "Required fields are missing" }
    ),
  },
  { required_error: "Required fields are missing" }
);

const findAllUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.enum(["asc", "desc", ""]).optional(),
    search: z.string().optional(),
  }),
});

const findOneUserSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "User id is required" }),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    fullname: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(["admin", "student"]).optional(),
  }),
});

const userSchema = {
  createUserSchema,
  loginUserSchema,
  findAllUsersSchema,
  findOneUserSchema,
  updateUserSchema,
};

export default userSchema;

export type UserSchema = {
  Create: z.infer<typeof createUserSchema>;
  Login: z.infer<typeof loginUserSchema>;
  FindAll: z.infer<typeof findAllUsersSchema>;
  FindOne: z.infer<typeof findOneUserSchema>;
  Update: z.infer<typeof updateUserSchema>;
};
