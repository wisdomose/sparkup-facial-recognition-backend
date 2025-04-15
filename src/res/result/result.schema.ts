import { z } from "zod";

const createResultSchema = z.object({
  body: z.object({
    semester: z.string().min(3),
    session: z.string().min(3),
    courses: z.array(
      z.object({
        code: z.string().min(3),
        title: z.string().min(3),
        unit: z.number().min(1),
        grade: z.number().min(1),
      })
    ),
    studentId: z.string(),
  }),
});

const findOneSchema = z.object({
  query: z.object({
    session: z.string().min(3),
    semester: z.string().min(3),
    studentId: z.string(),
  }),
});

const findAllSchema = z.object({
  query: z.object({
    session: z.string().min(3),
    semester: z.string().min(3),
    studentId: z.string(),
  }),
});

const updateResultSchema = z.object({
  body: z.object({
    semester: z.string().min(3),
    session: z.string().min(3),
    courses: z.array(
      z.object({
        code: z.string().min(3),
        title: z.string().min(3),
        unit: z.number().min(1),
        grade: z.number().min(1),
      })
    ),
    studentId: z.string(),
  }),
});

const deleteResultSchema = z.object({
  query: z.object({
    session: z.string().min(3),
    semester: z.string().min(3),
    studentId: z.string(),
  }),
});

const resultSchema = {
  createResultSchema,
  findOneSchema,
  findAllSchema,
  updateResultSchema,
  deleteResultSchema,
};

export default resultSchema;

export type ResultSchema = {
  CreateResult: z.infer<typeof createResultSchema>;
  FindOneResult: z.infer<typeof findOneSchema>;
  FindAllResults: z.infer<typeof findAllSchema>;
  UpdateResult: z.infer<typeof updateResultSchema>;
  DeleteResult: z.infer<typeof deleteResultSchema>;
};
