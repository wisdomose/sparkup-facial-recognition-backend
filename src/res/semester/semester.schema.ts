import { z } from "zod";

const createSemesterSchema = z.object({
  body: z.object({
    session: z.string().min(1),
    semester: z.enum(["first", "second"]),
    results: z.array(z.string()), // Assuming results are stored as IDs
    studentId: z.string(),
  }),
});

const findOneSchema = z.object({
  query: z.object({
    session: z.string().min(4),
    semester: z.enum(["first", "second"]),
    studentId: z.string(),
  }),
});

const findAllSchema = z.object({
  query: z.object({
    studentId: z.string(),
  }),
});

const updateSemesterSchema = z.object({
  body: z.object({
    session: z.string().min(4),
    semester: z.enum(["first", "second"]),
    results: z.array(z.string()),
    studentId: z.string(),
  }),
});

const deleteSemesterSchema = z.object({
  query: z.object({
    session: z.string().min(4),
    semester: z.enum(["first", "second"]),
    studentId: z.string(),
  }),
});

const semesterSchema = {
  findOneSchema,
  createSemesterSchema,
  findAllSchema,
  updateSemesterSchema,
  deleteSemesterSchema,
    };

export default semesterSchema;

export type SemesterSchema = {
  CreateSemester: z.infer<typeof createSemesterSchema>;
  FindOneSemester: z.infer<typeof findOneSchema>;
  FindAllSemesters: z.infer<typeof findAllSchema>;
  UpdateSemester: z.infer<typeof updateSemesterSchema>;
  DeleteSemester: z.infer<typeof deleteSemesterSchema>;
};
