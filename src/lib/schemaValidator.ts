import { envSchema } from "env-schema";

type Env = {
  PORT: number;
  SALT: number;
  DB_URI: string;
  SECRET: string;
  API_URL:string;
};

const schema = {
  type: "object",
  required: [
    "PORT",
    "SALT",
    "DB_URI",
    "SECRET",
    "API_URL"
  ],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    SALT: {
      type: "number",
    },
    DB_URI: { type: "string" },
    SECRET: { type: "string" },
    API_URL: { type: "string" },
  },
};

const schemaConfig = envSchema<Env>({
  schema: schema,
  dotenv: true,
});

export default schemaConfig;
