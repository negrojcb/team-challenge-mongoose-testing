const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("../index");
const Post = require("../models/Post");

describe("POST /posts/create", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("debería crear una publicación", async () => {
    const response = await request(app).post("/posts/create").send({
      title: "Test post",
      body: "Contenido de prueba",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Test post");
    expect(response.body.body).toBe("Contenido de prueba");
  });

  test("debería fallar si falta body", async () => {
    const response = await request(app).post("/posts/create").send({
      title: "Incompleto",
    });

    expect(response.statusCode).toBe(400);
  });
});
