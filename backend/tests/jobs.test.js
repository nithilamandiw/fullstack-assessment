const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const JobRequest = require("../models/JobRequest");
const User = require("../models/User");

jest.setTimeout(30000);

let authToken;

beforeAll(async () => {
  // Wait for MongoDB connection to be ready
  while (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const res = await request(app).post("/api/auth/register").send({
    name: "Test Runner",
    email: `testrunner_${Date.now()}@test.com`,
    password: "testpass123",
  });

  authToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/jobs", () => {
  it("should return a list of jobs", async () => {
    const res = await request(app).get("/api/jobs");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("count");
  });

  it("should filter jobs by category", async () => {
    const res = await request(app).get("/api/jobs?category=Plumbing");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach((job) => {
      expect(job.category).toBe("Plumbing");
    });
  });

  it("should filter jobs by status", async () => {
    const res = await request(app).get("/api/jobs?status=Open");

    expect(res.status).toBe(200);
    res.body.data.forEach((job) => {
      expect(job.status).toBe("Open");
    });
  });
});

describe("POST /api/jobs", () => {
  it("should reject unauthenticated requests", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Test Job",
      description: "Test Description",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should create a job with valid data and token", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Jest Test Job",
        description: "Created by automated test",
        category: "General",
        location: "Test City",
        contactName: "Tester",
        contactEmail: "tester@test.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Jest Test Job");
    expect(res.body.data.status).toBe("Open");
  });

  it("should reject a job without required fields", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("PATCH /api/jobs/:id", () => {
  let testJobId;

  beforeAll(async () => {
    const job = await JobRequest.create({
      title: "Patch Test Job",
      description: "For status update test",
      category: "Electrical",
      location: "Edinburgh",
    });
    testJobId = job._id;
  });

  it("should update job status with valid token", async () => {
    const res = await request(app)
      .patch(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "In Progress" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("In Progress");
  });

  it("should reject invalid status value", async () => {
    const res = await request(app)
      .patch(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "InvalidStatus" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/jobs/:id", () => {
  let testJobId;

  beforeAll(async () => {
    const job = await JobRequest.create({
      title: "Delete Test Job",
      description: "To be deleted",
      category: "Painting",
      location: "Glasgow",
    });
    testJobId = job._id;
  });

  it("should reject unauthenticated delete", async () => {
    const res = await request(app).delete(`/api/jobs/${testJobId}`);

    expect(res.status).toBe(401);
  });

  it("should delete a job with valid token", async () => {
    const res = await request(app)
      .delete(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
