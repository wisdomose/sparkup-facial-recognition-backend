import supertest from "supertest";
import app from "../lib/createServer";

describe("app", () => {
  describe("Status route", () => {
    it("Should be running without error", async () => {
      await supertest(app).get("/status").expect(200);
    });
  });
});
